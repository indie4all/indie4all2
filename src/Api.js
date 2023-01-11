/* global $ */
/* global bootprompt */
import CryptoJS from 'crypto-js';
import Author from "./Author";
import I18n from "./I18n";
import UndoRedo from "./undoredo";
import Utils from "./Utils";
import downloadTemplate from "./views/download.hbs"

export default class Api {

    #container;
    #i18n;
    #author;
    #undoredo;

    constructor(palette, container) {
        this.#container = container;
        this.#i18n = I18n.getInstance();
        this.#author = new Author(palette, container);
        this.#undoredo = UndoRedo.getInstance();
    }

    /**
     * Downloads a given file
     * @param {File} file - Blob with the contents of the compressed unit file
     */
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

    /**
     * Event to execute when a model has been published.
     * Creates a blob with the contents of the compressed unit file and downloads them.
     * @param {} response 
     * @returns 
     */
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
                self.#author.hideLoading();
                resolve();
            });
        });
    }

    /**
     * Shows a modal to fill with information about the current unit
     * @param {string} title - Title of the modal window
     * @param {function} onSubmit - Action to perform when the user submits the form
     */
    #openUnitSettings = function (title, onSubmit) {

        // Check if the model is valid before trying to download
        if (!this.validate()) {
            console.error(this.#i18n.translate("messages.contentErrors"));
            return;
        }

        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 
        const themes = ["GeneralTheme1", "GeneralTheme2", "GeneralTheme3", "GeneralTheme4", "GeneralTheme5",
        "GeneralTheme6", "GeneralTheme7", "GeneralTheme8", "GeneralTheme9", "GeneralTheme10", "GeneralTheme11",
        "GeneralTheme12", "GeneralTheme13", "GeneralTheme14", "GeneralTheme15", "GeneralTheme16", "GeneralTheme17",
        "GeneralTheme18"];
        const languages = ["EN", "ES", "FR", "EL", "LT"];
        const licenses = ["PRIVATE", "BY", "BYSA", "BYND", "BYNC", "BYNCSA", "BYNCND"];

        const model = this.#author.model;

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

    /**
     * Adds an empty section
     */
    addSection() { this.#author.addSection(undefined, true); }

    /**
     * Adds an empty model element into a container
     * @param {string} id - Container ID
     * @param {string} widget - Type of model element
     */
    addContent(id, widget) { this.#author.addContent(id, widget)}

    /**
     * Duplicates a given model element
     * @param {string} id - Model Element ID
     */
    copyElement(id) { 
        let sectionId = $(`[data-id=${id}]`).closest('.section-elements').attr('id').split('-').at(-1);
        this.#author.copyModelElement(this.#author.getModelElement(id), sectionId, true);
    }

    /**
     * Duplicates a given section
     * @param {string} id - SectionID
     */
    copySection(id) { 
        this.#author.copyModelSection(this.#author.getModelElement(id), true);    
    }

    /**
     * Loads a model element from LocalStorage into a given section
     * @param {string} id - Section ID
     */
    importElement(id) { 
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const encrypted = localStorage.getItem('copied-element');
            const json = CryptoJS.AES.decrypt(encrypted, userCookie.split('=')[1]).toString(CryptoJS.enc.Utf8);
            if (json) {
                this.#author.copyModelElement(JSON.parse(json), id, true);
                Utils.notifySuccess(this.#i18n.translate("messages.importedElement"));
                return;
            }
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.#i18n.translate("messages.noElement"));
        } catch (err) {
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.#i18n.translate("messages.noElement"));    
        }    
    }

    /**
     * Loads a given section from LocalStorage
     */
    importSection() { 
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const encrypted = localStorage.getItem('copied-section');
            const json = CryptoJS.AES.decrypt(encrypted, userCookie.split('=')[1]).toString(CryptoJS.enc.Utf8);
            if (json) {
                this.#author.copyModelSection(JSON.parse(json), true);
                Utils.notifySuccess(this.#i18n.translate("messages.importedSection"));
                return;
            }
            localStorage.removeItem('copied-section');
            Utils.notifyWarning(this.#i18n.translate("messages.noSection"));
        } catch (err) {
            localStorage.removeItem('copied-section');
            Utils.notifyWarning(this.#i18n.translate("messages.noSection"));
        } 
    }

    /**
     * Removes a given model element
     * @param {string} id - Model element ID
     */
    removeElement(id)  { this.#author.removeElement(id); }

    /**
     * Removes a given section
     * @param {String} id - Section ID
     */
    removeSection(id) { this.#author.removeSection(id); }

    /**
     * Opens a modal to edit the given element fields
     * @param {string} id - Model element ID
     */
    editElement(id) { this.#author.openSettings(id); }

    /**
     * Opens a modal to edit the given section fields
     * @param {string} id - Section ID
     */
    editSection(id) { this.#author.openSettings(id, "section"); }

    /**
     * Stores the given model element encrypted in LocalStorage using the user's cookie
     * @param {string} id - Model element ID 
     */
    exportElement(id) { 
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const key = userCookie.split('=')[1];
            const original = this.#author.getModelElement(id);
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(original), key).toString();
            localStorage.setItem('copied-element', encrypted);
            Utils.notifySuccess(this.#i18n.translate("messages.exportedElement"));
        } catch (err) {
            Utils.notifyWarning(this.#i18n.translate("messages.couldNotExportElement"));
        }
    }

    /**
     * Stores the given section encrypted in LocalStorage using the user's cookie
     * @param {string} id - Section ID
     */
    exportSection(id) { 
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const key = userCookie.split('=')[1];
            const original = this.#author.getModelElement(id);
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(original), key).toString();
            localStorage.setItem('copied-section', encrypted);
            Utils.notifySuccess(this.#i18n.translate("messages.exportedSection"));
        } catch (err) {
            Utils.notifyWarning(this.#i18n.translate("messages.couldNotExportSection"));
        }        
    }

    /**
     * Moves a given section up or down
     * @param {string} id - Section ID
     * @param {0,1} direction - Down (0) or Up (1)
     */
    swap(id, direction) { this.#author.swap(id, direction); }

    /**
     * Expands/Collapses the given category
     * @param {string} category - Category ID
     */
    toggleCategory(category) { this.#author.toggleCategory(category); }

    /**
     * Validates the current state of the model and shows its errors
     * @returns True if the model is valid, false otherwise
     */
    validate() {  return this.#author.validateContent(true); }

    /**
     * Clears the content of the editor
     */
    clear() {
        const self = this;
        bootprompt.confirm({
            title: this.#i18n.translate("general.areYouSure"),
            message: this.#i18n.translate("messages.confirmClearContent"),
            buttons: {
                confirm: {
                    label: this.#i18n.translate("general.delete"),
                    className: 'btn-danger'
                },
                cancel: {
                    label: this.#i18n.translate("general.cancel"),
                    className: 'btn-indie'
                }
            },
            callback: function (result) {
                if (result) {
                    $(self.#container).children().fadeOut(500, function () {
                        $(self.#container).empty();
                        Utils.notifySuccess(this.#i18n.translate("messages.contentCleared"));
                        this.#author.clearModelSections();
                    });
                }
            },
            closeButton: false,
        });
    }

    /**
     * Undoes an action
     */
    undo() { this.#undoredo.undo(); }

    /**
     * Repeats a previously undone action
     */
    redo() { this.#undoredo.redo(); }

    /**
     * Loads a model into the application
     * @param {object} model - The model to be loaded
     * @param {function} onLoaded - Event to trigger when the model has been loaded
     * @param {function} onError - Event to trigger when there has been an error
     */
    load(model, onLoaded, onError) {
        const self = this;
        try {
            $(self.#container).toggle(1000, function() {
                $(self.#container).empty();
                self.#author.loadModelIntoPlugin(model);
                $(self.#container).toggle(1000, onLoaded);
            });
        } catch (err) {
            $(self.#container).empty();
            self.#author.resetModel();
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
        const title = this.#i18n.translate("common.download");
        this.#openUnitSettings(title, onSubmit);
    }

    /**
     * Redirects the user to a previously generated unit
     */
    preview() {
        const self = this;
        const onSubmit = (model) => {
            self.#author.showLoading();
            const onGenerated = async (response) => {
                const uri = await response.text();
                window.open(uri, '_blank');
                self.#author.hideLoading();
            };
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'PUT', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch("/model/preview", requestOptions)
                .then(onGenerated)
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        }
        const title = this.#i18n.translate("common.preview");
        self.#openUnitSettings(title, onSubmit);
    }

    /**
     * Generates a zip file in SCORM format
     */
    scorm() {
        const self = this;
        const onSubmit = (model) => {
            self.#author.showLoading();
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'PUT', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch("/model/scorm", requestOptions)
                .then(self.#onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        }
        const title = this.#i18n.translate("common.publish");
        this.#openUnitSettings(title, onSubmit);
    }

    /**
     * Generates a zip file with the content of the unit
     */
    publish() {
        const self = this;
        const onSubmit = (model) => {
            self.#author.showLoading();
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'PUT', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch("/model/publish", requestOptions)
                .then(self.#onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        }
        const title = this.#i18n.translate("common.publish");
        this.#openUnitSettings(title, onSubmit);
    }
}