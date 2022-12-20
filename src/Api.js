/* global $ */
/* global bootprompt */
import Author from "./Author";
import I18n from "./I18n";
import UndoRedo from "./undoredo";
import Utils from "./Utils";
import downloadTemplate from "./views/download.hbs"

export default class Api {

    constructor(palette, container, onInit) {
        this.container = container;
        this.i18n = I18n.getInstance();
        this.author = new Author(palette, container, onInit);
        this.undoredo = UndoRedo.getInstance();
    }

    #downloadFile(file) {
        const link = document.createElement('a');
        const url = URL.createObjectURL(file)
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    #onPublishModel(response) {
        const self = this;
        return new Promise(resolve => {
            const type = response.headers.get('content-type');
            const filename = response.headers.get('content-disposition')
                .split(';')
                .find(n => n.trim().startsWith('filename='))
                .replace('filename=', '')
                .replaceAll('"', '')
                .trim();

            response.blob().then(blob => {
                const zip = new File([blob], filename, { type });
                self.#downloadFile(zip);
                self.author.hideLoading();
                resolve();
            });
        });
    }

    #openUnitSettings = function (title, onSubmit) {

        // Check if the model is valid before trying to download
        if (!this.validate()) {
            console.error(this.i18n.translate("messages.contentErrors"));
            return;
        }

        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 
        const themes = ["GeneralTheme1", "GeneralTheme2", "GeneralTheme3", "GeneralTheme4", "GeneralTheme5",
        "GeneralTheme6", "GeneralTheme7", "GeneralTheme8", "GeneralTheme9", "GeneralTheme10", "GeneralTheme11",
        "GeneralTheme12", "GeneralTheme13", "GeneralTheme14", "GeneralTheme15", "GeneralTheme16", "GeneralTheme17",
        "GeneralTheme18"];
        const languages = ["EN", "ES", "FR", "EL", "LT"];
        const licenses = ["PRIVATE", "BY", "BYSA", "BYND", "BYNC", "BYNCSA", "BYNCND"];

        const model = this.author.model;

        const data = {
            themes, 
            languages, 
            licenses, 
            title: model.title ?? '',
            user: model.user ?? '',
            email: model.email ?? '',
            institution: model.institution ?? '',
            language: model.language ?? '',
            theme: model.theme ?? '',
            license: model.license ?? ''
        };
        // Create the form
        document.getElementById('modal-settings-tittle').innerHTML = title;
        document.getElementById('modal-settings-body').innerHTML = downloadTemplate(data);
        $("#modal-settings").modal({ show: true, keyboard: false, focus: true, backdrop: 'static' });

        let form = document.getElementById('f-unit-settings');
        $(form).off('submit').on('submit', function (e) {
            e.preventDefault();
            const formData = Utils.toJSON(form);
            // Overwrite indieauthor.model with the specified data
            $.extend(model, formData);
            // Generate a new resourceId
            model.resourceId = Utils.generate_uuid();
            // Deep copy of the indieauthor model
            const myModel = $.extend(true, {}, model);
            // Remove unnecessary fields for the exported model
            delete myModel.VERSION_HISTORY;
            delete myModel.currentErrors;
            $("#modal-settings").modal('hide');
            onSubmit && onSubmit(myModel);
        });

        $("#modal-settings .btn-submit").on('click', function () {
            $("#modal-settings input[type='submit']").trigger('click');
        });
    }

    addSection() { this.author.addSection(undefined, true); }

    addContent(id, widget, type) { this.author.addContent(id, widget, type )}

    copyElement(id) { this.author.copyElement(id, true); }

    copySection(id) { this.author.copySection(id, true); }

    importElement(id) { this.author.importElement(id, true); }

    importSection() { this.author.importSection(true); }

    removeElement(id)  { this.author.removeElement(id); }

    removeSection(id) { this.author.removeSection(id); }

    editElement(id) { this.author.openSettings(id); }

    editSection(id) { this.author.openSettings(id, "section"); }

    exportElement(id) { this.author.exportElement(id); }

    exportSection(id) { this.author.exportSection(id); }

    swap(id, direction) { this.author.swap(id, direction); }

    toggleCategory(category) { this.author.toggleCategory(category); }

    validate() {  return this.author.validateContent(true); }

    /**
     * Clears the content of the editor
     */
    clear() {
        const self = this;
        bootprompt.confirm({
            title: this.i18n.translate("general.areYouSure"),
            message: this.i18n.translate("messages.confirmClearContent"),
            buttons: {
                confirm: {
                    label: this.i18n.translate("general.delete"),
                    className: 'btn-danger'
                },
                cancel: {
                    label: this.i18n.translate("general.cancel"),
                    className: 'btn-indie'
                }
            },
            callback: function (result) {
                if (result) {
                    $(self.container).children().fadeOut(500, function () {
                        $(self.container).empty();
                        Utils.notifySuccess(this.i18n.translate("messages.contentCleared"));
                        this.model.sections = [];
                    });
                }
            },
            closeButton: false,
        });
    }

    undo() { this.undoredo.undo(); }

    redo() { this.undoredo.redo(); }

    load(model, onLoaded, onError) {
        const self = this;
        try {
            $(self.container).toggle(1000, function() {
                $(self.container).empty();
                self.author.loadModelIntoPlugin(model);
                $(self.container).toggle(1000, onLoaded);
            });
        } catch (err) {
            $(self.container).empty();
            self.author.resetModel();
            onError && onError(err);
        }
    }

    /**
     * Downloads the current model in XText format
     */
    download() {
        const self = this;
        const onSubmit = (model) => {
            const file = new File([JSON.stringify(model, null, 2)], "model.json", { type: "application/json" });
            self.#downloadFile(file);
        };
        const title = this.i18n.translate("common.download");
        this.#openUnitSettings(title, onSubmit);
    }

    preview() {
        const self = this;
        const onSubmit = (model) => {
            self.author.showLoading();
            const onGenerated = async (response) => {
                const uri = await response.text();
                window.open(uri, '_blank');
                self.author.hideLoading();
            };
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'PUT', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch("/model/preview", requestOptions)
                .then(onGenerated)
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading(); 
                });
        }
        const title = this.i18n.translate("common.preview");
        self.#openUnitSettings(title, onSubmit);
    }

    /**
     * Generates a zip file in SCORM format
     */
    scorm() {
        const self = this;
        const onSubmit = (model) => {
            self.author.showLoading();
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'PUT', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch("/model/scorm", requestOptions)
                .then(self.#onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading(); 
                });
        }
        const title = this.i18n.translate("common.publish");
        this.#openUnitSettings(title, onSubmit);
    }

    /**
     * Generates a zip file with the content of the unit
     */
    publish() {
        const self = this;
        const onSubmit = (model) => {
            self.author.showLoading();
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'PUT', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch("/model/publish", requestOptions)
                .then(self.#onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading(); 
                });
        }
        const title = this.i18n.translate("common.publish");
        this.#openUnitSettings(title, onSubmit);
    }
}