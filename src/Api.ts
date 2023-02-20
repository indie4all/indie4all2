/* global $ */
import Author from "./Author";
import I18n from "./I18n";
import { Model } from "./model/Model";
import ModelManager from './model/ModelManager';
import Section from "./model/section/Section";
import { ConfigOptions } from "./types";
import UndoRedo from "./Undoredo";
import Utils from "./Utils";

export default class Api {

    private container: HTMLElement;
    private i18n: I18n;
    private author: Author;
    private undoredo: UndoRedo;
    private options: ConfigOptions;

    constructor(palette: HTMLElement, container: HTMLElement) {
        this.container = container;
        this.i18n = I18n.getInstance();
        this.options = {
            'requestAdditionalDataOnPopulate': true,
            'previewBackendURL': '/model/preview',
            'publishBackendURL': '/model/publish',
            'saveBackendURL': '/model/save',
            'scormBackendURL': '/model/scorm',
            'encryptionKey': null
        }
        this.author = new Author(palette, container);
        this.undoredo = UndoRedo.getInstance();

    }

    /**
     * Downloads a given file
     * @param {File} file - Blob with the contents of the compressed unit file
     */
    private downloadFile(file: File) {
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
    private onPublishModel(response: Response) {
        const self = this;
        if (!response.ok) {
            // Wait until the modal is fully loaded (1 sec)
            setTimeout(() => self.author.hideLoading(), 1000);
            Utils.notifyError(this.i18n.value("messages.publishError"));
            return;
        }

        return new Promise<void>(resolve => {
            const type = response.headers.get('content-type') ?? undefined;
            const filename = response.headers.get('content-disposition')?.split(';')
                .find((n: string) => n.trim().startsWith('filename='))?.replace('filename=', '')
                .replaceAll('"', '')
                .trim() ?? "model.zip";

            response.blob().then((blob: Blob) => {
                const zip = new File([blob], filename, { type });
                self.downloadFile(zip);
                self.author.hideLoading();
                resolve();
            });
        });
    }

    /**
     * Shows a modal to fill with information about the current unit
     * @param {string} title - Title of the modal window
     * @param {Function} onSubmit - Action to perform when the user submits the form
     */
    private openUnitSettings(title: string, onSubmit: Function) {

        import("./views/download.hbs").then(({ default: downloadTemplate }) => {
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
            $('#modal-settings-tittle').html(title);
            $('#modal-settings-body').html(downloadTemplate(data));
            $("#modal-settings").modal({ keyboard: false, focus: true, backdrop: 'static' });
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
     * @param {Function} onSubmit - Action to perform when the model is ready to be populated
     */
    populateModel(onSubmit: Function) {

        // Check if the model is valid before trying to download
        if (!this.validate()) {
            console.error(this.i18n.translate("messages.contentErrors"));
            return;
        }

        if (this.options['requestAdditionalDataOnPopulate'])
            this.openUnitSettings(this.i18n.value(`common.unit.settings`), onSubmit);
        else
            onSubmit && onSubmit(this.author.model);
    }

    /**
     * Encrypts a text if an encryptionKey is provided
     * @param {string} text - Text to be encrypted
     * @returns string - Encrypted text
     */
    private async encrypt(text: string): Promise<string> {
        const encOption = this.options['encryptionKey'];
        if (encOption === null)
            return new Promise(resolve => resolve(text));

        const { default: CryptoJS } = await import('crypto-js');
        const key = typeof encOption === 'function' ? encOption() : encOption;
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    /**
     * Decrypts a text if an encryptionKey is provided
     * @param {string} text - Text to be decrypted
     * @returns string - Decrypted text
     */
    private async decrypt(encrypted: string): Promise<string> {
        const encOption = this.options['encryptionKey'];
        if (encOption === null)
            return new Promise(resolve => resolve(encrypted));

        const { default: CryptoJS } = await import('crypto-js');
        const key = typeof encOption === 'function' ? encOption() : encOption;
        return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
    }

    /**
     * Updates the current options of the API
     * @param {object} options - set of options to update
     */
    setOptions(options: ConfigOptions) {
        $.extend(this.options, options);
    }

    /**
     * Adds an empty section
     */
    addSection() { this.author.addSection(); }

    /**
     * Adds an empty model element into a container
     * @param {string} id - Container ID
     * @param {string} widget - Type of model element
     */
    addContent(id: string, widget: string) { this.author.addContent(id, widget) }

    /**
     * Duplicates a given model element
     * @param {string} id - Model Element ID
     */
    copyElement(id: string) {
        let sectionId = <string>$(`[data-id=${id}]`).closest('.section-elements').attr('id')?.split('-').at(-1);
        this.author.copyModelElement(this.author.getModelElement(id), sectionId);
    }

    /**
     * Duplicates a given section
     * @param {string} id - SectionID
     */
    copySection(id: string) {
        this.author.copyModelSection(<Section>this.author.getModelElement(id));
    }

    /**
     * Loads a model element from LocalStorage into a given section
     * @param {string} id - Section ID
     */
    importElement(id: string) {
        try {
            const encrypted: string | null = localStorage.getItem('copied-element');
            if (!encrypted) {
                localStorage.removeItem('copied-element');
                Utils.notifyWarning(this.i18n.value("messages.noElement"));
                return;
            }

            this.decrypt(encrypted).then(json => {
                const elementJSON = JSON.parse(json);
                const modelElement = ModelManager.create(elementJSON.widget, elementJSON);
                this.author.copyModelElement(modelElement, id);
                Utils.notifySuccess(this.i18n.value("messages.importedElement"));
            });

        } catch (err) {
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.i18n.value("messages.noElement"));
        }
    }

    /**
     * Loads a given section from LocalStorage
     */
    importSection() {
        try {
            const encrypted: string | null = localStorage.getItem('copied-section');
            if (!encrypted) {
                localStorage.removeItem('copied-section');
                Utils.notifyWarning(this.i18n.value("messages.noSection"));
                return;
            }
            this.decrypt(encrypted).then(json => {
                const sectionJSON = JSON.parse(json);
                const sectionElement = ModelManager.create(sectionJSON.widget, sectionJSON);
                this.author.copyModelSection(<Section>sectionElement);
                Utils.notifySuccess(this.i18n.value("messages.importedSection"));
            });
        } catch (err) {
            localStorage.removeItem('copied-section');
            Utils.notifyWarning(this.i18n.value("messages.noSection"));
        }
    }

    /**
     * Removes a given model element
     * @param {string} id - Model element ID
     */
    removeElement(id: string) { this.author.removeElement(id); }

    /**
     * Removes a given section
     * @param {String} id - Section ID
     */
    removeSection(id: string) { this.author.removeSection(id); }

    /**
     * Opens a modal to edit the given element fields
     * @param {string} id - Model element ID
     */
    editElement(id: string) { this.author.openSettings(id); }

    /**
     * Stores the given model element encrypted in LocalStorage using the user's cookie
     * @param {string} id - Model element ID 
     */
    exportElement(id: string) {
        try {
            const original = this.author.getModelElement(id);
            this.encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-element', encrypted);
                Utils.notifySuccess(this.i18n.value("messages.exportedElement"));
            });
        } catch (err) {
            Utils.notifyWarning(this.i18n.value("messages.couldNotExportElement"));
        }
    }

    /**
     * Stores the given section encrypted in LocalStorage using the user's cookie
     * @param {string} id - Section ID
     */
    exportSection(id: string) {
        try {
            const original = this.author.getModelElement(id);
            this.encrypt(JSON.stringify(original)).then(encrypted => {
                localStorage.setItem('copied-section', encrypted);
                Utils.notifySuccess(this.i18n.value("messages.exportedSection"));
            });
        } catch (err) {
            Utils.notifyWarning(this.i18n.value("messages.couldNotExportSection"));
        }
    }

    /**
     * Moves a given section up or down
     * @param {string} id - Section ID
     * @param {0,1} direction - Down (0) or Up (1)
     */
    swap(id: string, direction: number) { this.author.swap(id, direction); }

    /**
     * Expands/Collapses the given category
     * @param {string} category - Category ID
     */
    toggleCategory(category: string) { this.author.toggleCategory(category); }

    /**
     * Validates the current state of the model and shows its errors
     * @returns True if the model is valid, false otherwise
     */
    validate() { return this.author.validateContent(true); }

    /**
     * Clears the content of the editor
     */
    clear() {
        const self = this;
        import('bootprompt').then(bootprompt => {
            bootprompt.confirm({
                title: this.i18n.value("general.areYouSure"),
                message: this.i18n.value("messages.confirmClearContent"),
                buttons: {
                    confirm: {
                        label: this.i18n.value("general.delete"),
                        className: 'btn-danger'
                    },
                    cancel: {
                        label: this.i18n.value("general.cancel"),
                        className: 'btn-indie'
                    }
                },
                callback: function (result) {
                    if (result) {
                        $(self.container).children().fadeOut(500).promise().done(() => {
                            $(self.container).empty();
                            Utils.notifySuccess(self.i18n.value("messages.contentCleared"));
                            self.author.clearModelSections();
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
    undo() { this.undoredo.undo(); }

    /**
     * Repeats a previously undone action
     */
    redo() { this.undoredo.redo(); }

    /**
     * Loads a model into the application
     * @param {object} model - The model to be loaded
     * @param {Function} onLoaded - Event to trigger when the model has been loaded
     * @param {Function} onError - Event to trigger when there has been an error
     */
    load(model: object, onLoaded: Function, onError: Function) {
        const self = this;
        try {
            self.author.showLoading();
            $(self.container).toggle(1000, function () {
                $(self.container).empty();
                self.author.loadModelIntoPlugin(model);
                $(self.container).toggle(1000, () => {
                    self.author.hideLoading();
                    onLoaded && onLoaded();
                });
            });
        } catch (err) {
            $(self.container).empty();
            self.author.resetModel();
            onError && onError(err);
        }
    }

    /**
     * Stores the model in the server
     */
    save() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.save.title");
            const description = this.i18n.value("common.save.description");
            self.author.showLoading(title, description);
            const onGenerated = async (response: Response) => {
                // Wait until the modal is fully loaded (1 sec)
                setTimeout(() => self.author.hideLoading(), 1000);
                if (!response.ok) {
                    Utils.notifyError(this.i18n.value("messages.saveError"));
                    return;
                }
                const json = await response.json();
                if (json.success)
                    Utils.notifySuccess(this.i18n.value("messages.savedUnit"));
                else
                    Utils.notifyError(this.i18n.value("messages.saveError"));
            };
            // Download the generated files
            if (this.options.saveBackendURL) {
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
                fetch(this.options.saveBackendURL, requestOptions)
                    .then(onGenerated)
                    .catch(error => {
                        console.log('error', error);
                        self.author.hideLoading();
                    });
            }
        };
        this.populateModel(onSubmit);
    }

    /**
     * Downloads the current model in XText format
     */
    download() {
        const self = this;
        const onSubmit = (model: Model) => {
            const file = new File([JSON.stringify(model, null, 2)], "model.json", { type: "application/json" });
            self.downloadFile(file);
        };
        this.populateModel(onSubmit);
    }

    /**
     * Redirects the user to a previously generated unit
     */
    preview() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.preview.title");
            const description = this.i18n.value("common.preview.description");
            self.author.showLoading(title, description);
            const onGenerated = async (response: Response) => {
                // Wait until the modal is fully loaded (1 sec)
                setTimeout(() => self.author.hideLoading(), 1000);
                if (!response.ok) {
                    Utils.notifyError(this.i18n.value("messages.previewError"));
                    return;
                }
                const json = await response.json();
                window.open(json.url, '_blank');
                $('#modal-preview-generated-url').html(json.url);
                $('#modal-preview-generated-url').attr('href', json.url);
                $('#modal-preview-generated').modal({ backdrop: true });
            };
            // Download the generated files
            if (this.options.previewBackendURL) {
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
                fetch(this.options.previewBackendURL, requestOptions)
                    .then(onGenerated)
                    .catch(error => {
                        console.log('error', error);
                        self.author.hideLoading();
                    });
            }
        }
        self.populateModel(onSubmit);
    }

    /**
     * Generates a zip file in SCORM format
     */
    scorm() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.scorm.title");
            const description = this.i18n.value("common.scorm.description");
            self.author.showLoading(title, description);
            if (this.options.scormBackendURL) {
                // Download the generated files
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
                fetch(this.options.scormBackendURL, requestOptions)
                    .then(self.onPublishModel.bind(self))
                    .catch(error => {
                        console.log('error', error);
                        self.author.hideLoading();
                    });
            }
        }
        this.populateModel(onSubmit);
    }

    /**
     * Generates a zip file with the content of the unit
     */
    publish() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.publish.title");
            const description = this.i18n.value("common.publish.description");
            self.author.showLoading(title, description);
            if (this.options.publishBackendURL) {
                // Download the generated files
                const headers = new Headers();
                headers.append("Content-Type", "application/json");
                const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
                fetch(this.options.publishBackendURL, requestOptions)
                    .then(self.onPublishModel.bind(self))
                    .catch(error => {
                        console.log('error', error);
                        self.author.hideLoading();
                    });
            }
        }
        this.populateModel(onSubmit);
    }
}