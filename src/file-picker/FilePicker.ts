import I18n from "../I18n";
import Utils from "../Utils";
import "./styles.scss";
import "./types"

export default class FilePicker {

    static container: HTMLElement;

    private repoURL: string;
    private path: FilePickerBreadcrumb[] = [{ name: "Home", id: "" }]
    private currentPage: number = 0;
    private onSubmit: Function;
    private onHidden: Function;

    constructor(repoURL: string) {
        this.repoURL = repoURL;
    }

    setOnSubmit(handler: Function) {
        this.onSubmit = handler;
    }

    setOnHidden(handler: Function) {
        this.onHidden = handler;
    }

    async renderBreadcrumbs() {
        const { default: content } = await import('./views/breadcrumbs.hbs');
        $('#modal-file-picker').find('.file-picker-breadcrumbs').html(content({ steps: this.path }));
    }

    async renderElements(elements: FilePickerElement[]) {
        const $content = $('#modal-file-picker').find('.file-picker-entries');
        if (!elements.length) {
            const text = I18n.getInstance().value("common.file-picker.no-files");
            $content.html(`<li class="no-entries mt-4" tabindex="-1">${text}</div>`);
            return;
        }

        const { default: file } = await import('./views/file.hbs');
        const html = (await Promise.all(elements.map(async (entry) => {
            const extension = entry.extension || "";
            let name = entry.name;
            let id = entry.elementId;
            let type = entry.elementType.toLowerCase();
            let url = this.repoURL + `/content/${entry.elementId}${extension}`;
            let thumbnail: string = "";
            switch (type) {
                case "image":
                    thumbnail = this.repoURL + `/thumbnail/${entry.elementId}`;
                    break;
                case "video":
                    const video = entry as FilePickerFile;
                    thumbnail = video.thumbnail;
                    // endpointTranscoded contains the Vimeo identifier
                    url = this.repoURL + `/content/${video.endpointTranscoded}`;

            }
            return file({ name, id, thumbnail, type, url });
        }))).join("");
        $content.html(html);
    }

    async renderFilePagination(currentPage: number, totalPages: number) {
        const { default: pagination } = await import('./views/pagination.hbs');
        const $pagination = $('#modal-file-picker').find('.file-picker-pagination');
        $pagination.html(pagination({ currentPage, pages: [...Array(totalPages).keys()].map(e => e + 1) }));
    }

    async draw(page: number = 0, options: FilePickerDrawOptions = { files: true, pages: true, breadcrumbs: true }) {
        $('#modal-file-picker').addClass('loading');
        const folderId = this.path[this.path.length - 1].id;
        const headers = new Headers();
        headers.append("Accept", "application/json");
        const response = await fetch(this.repoURL + `/${folderId}?page=${page}`, { headers });
        if (response.status == 401) {
            // The token has expired, hide FilePicker and notify the user
            $('#modal-file-picker').hide();
            Utils.notifyError(I18n.getInstance().value("common.file-picker.unauthorized"));
            return;
        }
        const content = await response.json() as FilePickerResponse;
        options?.breadcrumbs && await this.renderBreadcrumbs();
        options?.pages && await this.renderFilePagination(content.elements.currentPage, content.elements.totalPages);
        options?.files && await this.renderElements(content.elements.data);
        $('#modal-file-picker').find('.btn-submit').prop('disabled', true);
        $('#modal-file-picker').removeClass('loading');
    }

    async show() {
        const self = this;
        this.currentPage = 0;
        const container = FilePicker.container || document.body;
        const { default: form } = await import('./views/template.hbs');
        $('#modal-file-picker').length && $('#modal-file-picker').remove();
        $(container).after(form());
        this.draw();

        $('#modal-file-picker')
            .on('click', '.file-picker-page', function (e) {
                $('#modal-file-picker .file-picker-page').removeClass('active');
                self.currentPage = parseInt(this.dataset.page);
                $(this).parent().find(`.file-picker-page[data-page="${self.currentPage}"]`).addClass('active');
                // Redraw only the files panel
                self.draw(self.currentPage, { files: true });
            })
            // Not triggered on a <li> item
            .on('keydown', '.file-picker-entry', function (e) {
                if (e.key === "Enter" || e.key === " ") $(this).trigger('click');
            })
            .on('click', '.file-picker-folder', function (e) {
                self.currentPage = 0;
                self.path.push({ name: this.dataset.name, id: this.dataset.id });
                self.draw().then(() => $('#modal-file-picker').find('.file-picker-entries').trigger('focus'));
            })
            .on('click', '.file-picker-file, .file-picker-audio, .file-picker-image, .file-picker-video', function (e) {
                $('.file-picker-entry').removeClass('active');
                $(this).addClass('active');
                $('#modal-file-picker').find('.btn-submit').prop('disabled', false);
            })
            .on('click', '.file-picker-breadcrumb', function (e) {
                const $list = $(this).parent();
                const index = $list.children().index(this);
                self.currentPage = 0;
                self.path = self.path.slice(0, index + 1);
                self.draw().then(() => {
                    const current = self.path[self.path.length - 1];
                    if (current.id) $list.find('.file-picker-breadcrumb[data-folder-id="' + current.id + '"] a').trigger('focus');
                    else $list.find('.file-picker-breadcrumb:first a').trigger('focus');
                });

            })
            .on('click', '.btn-submit', function (e) {
                const $modal = $('#modal-file-picker');
                const url = $modal.find('.file-picker-entry.active').first().get(0).dataset.url;
                $modal.modal('hide');
                self?.onSubmit(url);
            })
            .on('hidden.bs.modal', function (e) { self?.onHidden(); })
            .modal({ keyboard: false, focus: true, backdrop: false });
    }
}