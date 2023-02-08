/* global $ */
import Author from "./Author";
import I18n from "./I18n";
import ModelManager from './model/ModelManager';
import UndoRedo from "./Undoredo";
import Utils from "./Utils";

export default class Api {

    #container;
    #i18n;
    #author;
    #undoredo;
    /**
     * API configuration options. Values:
     * - `requestAdditionalDataOnPopulate`: (boolean) sets if the API should show a modal asking for additional information when publishing a unit. Default value: true.
     * - `previewBackendURL`: (string) server URL to preview the current unit. Default value: '/model/preview'.
     * - `publishBackendURL`: (string) server URL to publish the current unit. Default value: '/model/publish'.
     * - `saveBackendURL`: (string) server URL to store the contents of the unit. Default value: '/model/save'.
     * - `scormBackendURL`: (string) server URL to generate a scorm package with the contents of the unit. Default value: '/model/scorm'.
     * - `encryptionKey`: (function|string|null) key to encrypt sensitive data. If null, no encryption is done.
     */
    #options;

    constructor(palette, container) {
        this.#container = container;
        this.#i18n = I18n.getInstance();
        this.#options = {
            'requestAdditionalDataOnPopulate': true,
            'previewBackendURL': '/model/preview',
            'publishBackendURL': '/model/publish',
            'saveBackendURL': '/model/save',
            'scormBackendURL': '/model/scorm',
            'encryptionKey': null
        }
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
        if (!response.ok) {
            // Wait until the modal is fully loaded (1 sec)
            setTimeout(() => self.#author.hideLoading(), 1000);
            Utils.notifyError(this.#i18n.translate("messages.publishError"));
            return;
        }
        
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
    #openUnitSettings(title, onSubmit) {

        import("./views/download.hbs").then(({default: downloadTemplate}) => {
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
            $('#modal-settings-tittle').html(title);
            $('#modal-settings-body').html(downloadTemplate(data));
            $("#modal-settings").modal({ show: true, keyboard: false, focus: true, backdrop: 'static' });
            $('#f-unit-settings').off('submit').on('submit', function (e) {
                e.preventDefault();
                model.update(Utils.toJSON(this));   // Overwrite indieauthor.model with the specified data
                $("#modal-settings").modal('hide'); // Hide the modal
                onSubmit && onSubmit(model);
            });

            $("#modal-settings .btn-submit").on('click', function () {
                $("#modal-settings input[type='submit']").trigger('click');
            });
        });
    }

    /**
     * Populates a model to a server, optionally showing a modal for requesting additional information
     * @param {string} title - Title of the modal window
     * @param {function} onSubmit - Action to perform when the model is ready to be populated
     */
    #populateModel(onSubmit) {
        
        // Check if the model is valid before trying to download
        if (!this.validate()) {
            console.error(this.#i18n.translate("messages.contentErrors"));
            return;
        }

        if (this.#options['requestAdditionalDataOnPopulate'])
            this.#openUnitSettings(this.#i18n.value(`common.unit.settings`), onSubmit);
        else
            onSubmit && onSubmit(this.#author.model);
    }

    /**
     * Encrypts a text if an encryptionKey is provided
     * @param {string} text - Text to be encrypted
     * @returns string - Encrypted text
     */
    #encrypt(text) {
        const encOption = this.#options['encryptionKey'];
        if (encOption === null)
            return new Promise(resolve => resolve(text));

        import('crypto-js')
        .then(({default: CryptoJS}) => {
            const key = typeof encOption === 'function' ? encOption() : encOption;
            return CryptoJS.AES.encrypt(text, key).toString();
        });    
    }

    /**
     * Decrypts a text if an encryptionKey is provided
     * @param {string} text - Text to be decrypted
     * @returns string - Decrypted text
     */
    #decrypt(encrypted) {
        const encOption = this.#options['encryptionKey'];
        if (encOption === null)
            return new Promise(resolve => resolve(encrypted));

        import('crypto-js')
        .then(({default: CryptoJS}) => {
            const key = typeof encOption === 'function' ? encOption() : encOption;
            return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
        });
    }

    /**
     * Updates the current options of the API
     * @param {object} options - set of options to update
     */
    setOptions(options) {
        $.extend(this.#options, options);
    }

    /**
     * Adds an empty section
     */
    addSection() { this.#author.addSection(); }

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
        this.#author.copyModelElement(this.#author.getModelElement(id), sectionId);
    }

    /**
     * Duplicates a given section
     * @param {string} id - SectionID
     */
    copySection(id) { 
        this.#author.copyModelSection(this.#author.getModelElement(id));    
    }

    /**
     * Loads a model element from LocalStorage into a given section
     * @param {string} id - Section ID
     */
    importElement(id) { 
        try {
            const encrypted = localStorage.getItem('copied-element');
            this.#decrypt(encrypted).then(json => {
                if (json) {
                    const elementJSON = JSON.parse(json);
                    const modelElement = ModelManager.create(elementJSON.widget, elementJSON);
                    this.#author.copyModelElement(modelElement, id);
                    Utils.notifySuccess(this.#i18n.translate("messages.importedElement"));
                    return;
                }
                localStorage.removeItem('copied-element');
                Utils.notifyWarning(this.#i18n.translate("messages.noElement"));
            });
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
            const encrypted = localStorage.getItem('copied-section');
            this.#decrypt(encrypted).then(json => {
                if (json) {
                    const sectionJSON = JSON.parse(json);
                    const sectionElement = ModelManager.create(sectionJSON.widget, sectionJSON);
                    this.#author.copyModelSection(sectionElement);
                    Utils.notifySuccess(this.#i18n.translate("messages.importedSection"));
                    return;
                }
                localStorage.removeItem('copied-section');
                Utils.notifyWarning(this.#i18n.translate("messages.noSection"));
            });
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
     * Stores the given model element encrypted in LocalStorage using the user's cookie
     * @param {string} id - Model element ID 
     */
    exportElement(id) {
        try {
            const original = this.#author.getModelElement(id);
            this.#encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-element', encrypted);
                Utils.notifySuccess(this.#i18n.translate("messages.exportedElement"));
            });
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
            const original = this.#author.getModelElement(id);
            this.#encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-section', encrypted);
                Utils.notifySuccess(this.#i18n.translate("messages.exportedSection"));
            });
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
        import('bootprompt').then(bootprompt => {
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
            self.#author.showLoading();
            $(self.#container).toggle(1000, function() {
                $(self.#container).empty();
                self.#author.loadModelIntoPlugin(model);
                $(self.#container).toggle(1000, () => {
                    self.#author.hideLoading();
                    onLoaded && onLoaded();
                });
            });
        } catch (err) {
            $(self.#container).empty();
            self.#author.resetModel();
            onError && onError(err);
        }
    }

    /**
     * Stores the model in the server
     */
    save() {
        const self = this;
        const onSubmit = (model) => {
            const title = this.#i18n.value("common.save.title");
            const description = this.#i18n.value("common.save.description");
            self.#author.showLoading(title, description);
            const onGenerated = async (response) => {
                // Wait until the modal is fully loaded (1 sec)
                setTimeout(() => self.#author.hideLoading(), 1000);
                if (!response.ok) {
                    Utils.notifyError(this.#i18n.translate("messages.saveError"));
                    return;
                }
                const json = await response.json();
                if (json.success)
                    Utils.notifySuccess(this.#i18n.translate("messages.savedUnit"));
                else
                    Utils.notifyError(this.#i18n.translate("messages.saveError"));
            };
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch(this.#options['saveBackendURL'], requestOptions)
                .then(onGenerated)
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        };
        this.#populateModel(onSubmit);
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
        this.#populateModel(onSubmit);
    }

    /**
     * Redirects the user to a previously generated unit
     */
    preview() {
        const self = this;
        const onSubmit = (model) => {
            const title = this.#i18n.value("common.preview.title");
            const description = this.#i18n.value("common.preview.description");
            self.#author.showLoading(title, description);
            const onGenerated = async (response) => {
                // Wait until the modal is fully loaded (1 sec)
                setTimeout(() => self.#author.hideLoading(), 1000);
                if (!response.ok) {
                    Utils.notifyError(this.#i18n.translate("messages.previewError"));
                    return;
                }
                const json = await response.json();
                window.open(json.url, '_blank');
                $('#modal-preview-generated-url').html(json.url);
                $('#modal-preview-generated-url').attr('href', json.url);
                $('#modal-preview-generated').modal({show: true, backdrop: true});
            };
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch(this.#options['previewBackendURL'], requestOptions)
                .then(onGenerated)
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        }
        self.#populateModel(onSubmit);
    }

    /**
     * Generates a zip file in SCORM format
     */
    scorm() {
        const self = this;
        const onSubmit = (model) => {
            const title = this.#i18n.value("common.scorm.title");
            const description = this.#i18n.value("common.scorm.description");
            self.#author.showLoading(title, description);
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch(this.#options['scormBackendURL'], requestOptions)
                .then(self.#onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        }
        this.#populateModel(onSubmit);
    }

    /**
     * Generates a zip file with the content of the unit
     */
    publish() {
        const self = this;
        const onSubmit = (model) => {
            const title = this.#i18n.value("common.publish.title");
            const description = this.#i18n.value("common.publish.description");
            self.#author.showLoading(title, description);
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), redirect: 'follow', headers };
            fetch(this.#options['publishBackendURL'], requestOptions)
                .then(self.#onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.#author.hideLoading(); 
                });
        }
        this.#populateModel(onSubmit);        
    }
}