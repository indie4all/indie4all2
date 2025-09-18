import { inject, injectable } from "inversify";
import "./styles.scss";
import "./types"
import UtilsService from "../utils/utils.service";
import I18nService from "../i18n/i18n.service";
import BootstrapService from "../bootstrap/bootstrap.service";

@injectable()
export default class FilePickerService {

    private repoURL: string;
    private path: FilePickerBreadcrumb[] = [{ name: "Home", id: "" }]
    private currentPage: number = 0;
    private onSubmit: Function;
    private onHidden: Function;

    @inject(UtilsService) private utils: UtilsService;
    @inject(I18nService) private i18n: I18nService;
    @inject(BootstrapService) private bootstrap: BootstrapService;

    constructor() { }

    init(repoURL: string) { this.repoURL = repoURL; }

    setOnSubmit(handler: Function) { this.onSubmit = handler; }

    setOnHidden(handler: Function) { this.onHidden = handler; }

    async renderBreadcrumbs() {
        const { default: content } = await import('./views/breadcrumbs.hbs');
        const modalElem = document.getElementById('modal-file-picker');
        modalElem.querySelector('.file-picker-breadcrumbs').innerHTML = content({ steps: this.path });
    }

    async renderElements(elements: FilePickerElement[]) {
        const modalElem = document.getElementById('modal-file-picker');
        const content = modalElem.querySelector('.file-picker-entries');
        if (!elements.length) {
            const text = this.i18n.value("common.file-picker.no-files");
            content.innerHTML = `<li class="no-entries mt-4" tabindex="-1">${text}</div>`;
            return;
        }

        const { default: file } = await import('./views/file.hbs');
        const html = (await Promise.all(elements.map(async (entry) => {
            const extension = entry.extension || "";
            const name = entry.name;
            const id = entry.elementId;
            const type = entry.elementType.toLowerCase();
            let url = this.repoURL + `/content/${entry.elementId}${extension}`;
            let thumbnail: string = "";
            // Directories are ready by default
            let status: string = "PROCESSED";
            switch (type) {
                case "file":
                    const file = entry as FilePickerFile;
                    status = file.status;
                    break;
                case "image":
                    const img = entry as FilePickerFile;
                    thumbnail = this.repoURL + `/thumbnail/${img.elementId}`;
                    status = img.status;
                    break;
                case "video":
                    const video = entry as FilePickerFile;
                    thumbnail = video.thumbnail;
                    // endpointTranscoded contains the Vimeo identifier
                    url = this.repoURL + `/content/${video.endpointTranscoded}`;
                    status = video.status;

            }
            return file({ name, id, thumbnail, type, url, status });
        }))).join("");
        content.innerHTML = html;
    }

    async renderFilePagination(currentPage: number, totalPages: number) {
        const modalElem = document.getElementById('modal-file-picker');
        const paginationElem = modalElem.querySelector('.file-picker-pagination');
        const { default: pagination } = await import('./views/pagination.hbs');
        paginationElem.innerHTML = pagination({ currentPage, pages: [...Array(totalPages).keys()].map(e => e + 1) });
    }

    async draw(page: number = 0, options: FilePickerDrawOptions = { files: true, pages: true, breadcrumbs: true }) {
        const modalElem = document.getElementById('modal-file-picker');
        const modalModule = await this.bootstrap.loadModalModule();
        const modal = modalModule.getOrCreateInstance(modalElem, { keyboard: false, focus: true, backdrop: false });
        modalElem.classList.add('loading');
        const folderId = this.path[this.path.length - 1].id;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        const response = await fetch(this.repoURL + `/${folderId}?page=${page}`, { headers });
        if (response.status == 401) {
            // The token has expired, hide FilePicker and notify the user
            modal.hide();
            this.utils.notifyError(this.i18n.value("common.file-picker.unauthorized"));
            return;
        }
        const content = await response.json() as FilePickerResponse;
        options?.breadcrumbs && await this.renderBreadcrumbs();
        options?.pages && await this.renderFilePagination(content.elements.currentPage, content.elements.totalPages);
        options?.files && await this.renderElements(content.elements.data);
        (modalElem.querySelector('.btn-submit') as HTMLButtonElement).disabled = true;
        modalElem.classList.remove('loading');
    }

    async show() {
        this.currentPage = 0;
        return new Promise<void>(async (resolve) => {
            const { default: template } = await import('./views/template.hbs');
            document.body.insertAdjacentHTML('beforeend', template());
            const modalElem = document.getElementById('modal-file-picker');
            const modalModule = await this.bootstrap.loadModalModule();
            const modal = modalModule.getOrCreateInstance(modalElem, { keyboard: false, focus: true, backdrop: false });
            // [Fix] https://github.com/twbs/bootstrap/issues/41005
            modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
            modalElem.addEventListener('hidden.bs.modal', () => {
                this?.onHidden();
                modalElem.remove();
            });
            modalElem.addEventListener('shown.bs.modal', () => resolve());
            modalElem.addEventListener('click', (e) => {
                if (!(e.target instanceof HTMLElement) && !(e.target instanceof SVGElement)) return;
                e.preventDefault();
                // The user clicks on a page number
                if (e.target.closest('.file-picker-page')) {
                    const page = e.target.closest('.file-picker-page') as HTMLElement;
                    modalElem.querySelectorAll('.file-picker-page').forEach(e => e.classList.remove('active'));
                    page.classList.add('active');
                    this.currentPage = parseInt(page.dataset.page);
                    this.draw(this.currentPage, { files: true });
                }
                // The user clicks on a folder
                else if (e.target.closest('.file-picker-folder')) {
                    const folder = e.target.closest('.file-picker-folder') as HTMLElement;
                    this.currentPage = 0;
                    this.path.push({ name: folder.dataset.name, id: folder.dataset.id });
                    this.draw().then(() => (modalElem.querySelector('.file-picker-entries') as HTMLElement).focus());
                }
                // The user clicks on a file which is not a folder
                else if (e.target.closest('.file-picker-entry') && !e.target.closest('.file-picker-folder')) {
                    const entry = e.target.closest('.file-picker-entry') as HTMLElement;
                    modalElem.querySelectorAll('.file-picker-entry').forEach(e => e.classList.remove('active'));
                    entry.classList.add('active');
                    const valid = entry.dataset.status === "PROCESSED";
                    const btnSubmit = modalElem.querySelector('.btn-submit') as HTMLButtonElement;
                    btnSubmit.disabled = !valid;
                }
                // The user clicks on a breadcrumb item
                else if (e.target.closest('.file-picker-breadcrumb')) {
                    const breadcrumbsList = modalElem.querySelector('.file-picker-breadcrumbs') as HTMLElement;
                    const breadcrumb = e.target.closest('.file-picker-breadcrumb') as HTMLElement;
                    const index = Array.from(breadcrumbsList.children).indexOf(breadcrumb);
                    this.currentPage = 0;
                    this.path = this.path.slice(0, index + 1);
                    this.draw().then(() => {
                        const current = this.path[this.path.length - 1];
                        if (current.id) breadcrumb.querySelector('a').focus();
                        else (breadcrumbsList.querySelector('.file-picker-breadcrumb:first a') as HTMLAnchorElement).focus();
                    });
                }
                // The user clicks on the submit button
                else if (e.target.closest('.btn-submit')) {
                    const url = (modalElem.querySelector('.file-picker-entry.active') as HTMLElement).dataset.url;
                    modal.hide();
                    this.onSubmit(url);
                }
            });
            modalElem.addEventListener('keydown', (e) => {
                if (!(e.target instanceof HTMLElement)) return;
                // The user presses the Enter key on a file
                if (e.target.closest('.file-picker-file')) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.target.click();
                        e.preventDefault();
                    }
                }
            });
            await this.draw();
            modal.show();
        });
    }
}