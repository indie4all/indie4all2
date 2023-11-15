import I18n from "../I18n";
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

    async renderFiles(files: FilePickerFile[]) {
        const $content = $('#modal-file-picker').find('.file-picker-files');
        if (!files.length) {
            const text = I18n.getInstance().translate("common.file-picker.no-files");
            $content.html(`<li class="no-entries">${text}</div>`);
            return;
        }

        const html = (await Promise.all(files.map(async (entry) => {
            const { default: file } = await import('./views/file.hbs');
            const url = this.repoURL + `/content/${entry.mediaFileId}`;
            let thumbnail: string = "";
            if (entry.fileType === "IMAGE")
                thumbnail = this.repoURL + `/thumbnail/${entry.mediaFileId}`;
            else if (entry.fileType === "VIDEO")
                thumbnail = entry.thumbnail;
            return file({
                name: entry.title, id: entry.mediaFileId,
                thumbnail,
                type: entry.fileType.toString().toLowerCase(),
                url
            });
        }))).join("");
        $content.html(html);
    }

    async renderFolders(folders: FilePickerDirectory[]) {
        const $content = $('#modal-file-picker').find('.file-picker-folders');
        if (!folders.length) {
            const text = I18n.getInstance().translate("common.file-picker.no-folders");
            $content.html(`<li class="no-entries">${text}</div>`);
            return;
        }

        const html = (await Promise.all(folders.map(async (entry) => {
            const { default: directory } = await import('./views/folder.hbs');
            return directory({ name: entry.name, id: entry.id });
        }))).join("");


        $content.html(html);
    }

    async renderFilePagination(currentPage: number, totalPages: number) {
        const { default: pagination } = await import('./views/pagination.hbs');
        const $pagination = $('#modal-file-picker').find('.file-picker-pagination');
        $pagination.html(pagination({ currentPage, pages: [...Array(totalPages).keys()].map(e => e + 1) }));
    }

    async draw(page: number = 0, options: FilePickerDrawOptions = { files: true, folders: true, pages: true, breadcrumbs: true }) {
        const folderId = this.path[this.path.length - 1].id;
        const response = await fetch(this.repoURL + `/${folderId}?page=${page}`).then(res => res.json()) as FilePickerResponse;
        options?.breadcrumbs && this.renderBreadcrumbs();
        options?.files && this.renderFiles(response.mediaFiles.data);
        options?.folders && this.renderFolders(response.folders.data);
        options?.pages && this.renderFilePagination(response.mediaFiles.currentPage, response.mediaFiles.totalPages);
        $('#modal-file-picker').find('.btn-submit').prop('disabled', true);
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
            .on('click', '.file-picker-folder', function (e) {
                self.currentPage = 0;
                self.path.push({ name: this.dataset.name, id: this.dataset.id });
                self.draw();
            })
            .on('click', '.file-picker-file', function (e) {
                $('.file-picker-file').removeClass('active');
                $(this).addClass('active');
                $('#modal-file-picker').find('.btn-submit').prop('disabled', false);
            })
            .on('click', '.file-picker-breadcrumb', function (e) {
                const $list = $(this).parent();
                const index = $list.children().index(this);
                self.currentPage = 0;
                self.path = self.path.slice(0, index + 1);
                self.draw();
            })
            .on('click', '.btn-submit', function (e) {
                const $modal = $('#modal-file-picker');
                const url = $modal.find('.file-picker-file.active').first().get(0).dataset.url;
                $modal.modal('hide');
                self?.onSubmit(url);
            })
            .on('hidden.bs.modal', function (e) { self?.onHidden(); })
            .modal({ keyboard: false, focus: true, backdrop: false });
    }
}