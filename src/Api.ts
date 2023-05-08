/* global $ */
import Author from "./Author";
import I18n from "./I18n";
import { Model } from "./model/Model";
import ModelManager from './model/ModelManager';
import Section from "./model/section/Section";
import UndoRedo from "./Undoredo";
import Utils from "./Utils";
import Config from "./Config";

export default class Api {

    private static ALLOWED_LANGUAGES = ["EN", "ES", "FR", "EL", "LT"];
    private container: HTMLElement;
    private i18n: I18n;
    private author: Author;
    private undoredo: UndoRedo;

    static async create(palette: HTMLElement, container: HTMLElement): Promise<Api> {
        const result = new Api(container);
        result.author = await Author.create(palette, container);
        return result;
    }

    constructor(container: HTMLElement) {
        this.container = container;
        this.i18n = I18n.getInstance();
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
    private async openUnitSettings(title: string, onSubmit: Function) {

        await import("@melloware/coloris/dist/coloris.css");
        const { default: downloadTemplate } = await import("./views/download.hbs");
        const { default: Coloris } = await import("@melloware/coloris");
        const { default: themeManager } = await import('./themes/ThemeManager');
        const themes = themeManager.getThemes();
        themes.unshift("Custom");
        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 
        const licenses = ["PRIVATE", "BY", "BYSA", "BYND", "BYNC", "BYNCSA", "BYNCND"];
        const model = this.author.model;
        const data = {
            themes,
            languages: Api.ALLOWED_LANGUAGES,
            licenses,
            title: model.title ?? '',
            user: model.user ?? '',
            email: model.email ?? '',
            institution: model.institution ?? '',
            language: model.language ?? '',
            theme: model.theme ?? '',
            license: model.license ?? ''
        };
        Coloris.init();
        // Create the form
        $('#modal-settings-tittle').html(title);
        $('#modal-settings-body').html(downloadTemplate(data));
        const $coverPicker = $("#custom-theme-background");
        const $colorPicker = $("#custom-theme-color-picker");
        const $preview = $("#img-cover-preview");
        const $blob = $('#img-cover-blob');
        const updateThemeOptions = function (e) {
            const theme: string = $(this).val() as string;
            const isCustom = theme === 'Custom';
            $coverPicker.add($colorPicker)
                .prop("disabled", !isCustom)
                .css('pointer-events', isCustom ? 'auto' : 'none')
                .val('');
            $preview.toggleClass('d-none', true).attr('src', '');
            $colorPicker.closest(".clr-field").css('color', '');
            $colorPicker.find('button').prop('disabled', !isCustom);
            $blob.val('');
            if (isCustom) {
                $blob.val(model.cover ?? '');
                $colorPicker.val(model.color ?? '').closest(".clr-field").css('color', model.color ?? '');
                $preview.toggleClass('d-none', !model.cover).attr('src', model.cover ?? '');
                return;
            }

            // Disable automatically added color button
            themeManager.load(theme).then(info => {
                const blob = info.cover as string;
                $("#custom-theme-color-picker").val(info.color);
                $colorPicker.closest(".clr-field").css('color', info.color);
                $preview.toggleClass('d-none', false).attr("src", blob);
                $blob.val(blob);
            });
        }

        $coverPicker.off('change').on('change', function () {
            const self = <HTMLInputElement>this;
            $blob.val('');
            $preview.toggleClass('d-none', true).attr('src', '');
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $blob.val(<string>value);
                    $preview.toggleClass('d-none', false).attr('src', <string>value);
                });
            }
        });

        Coloris.coloris({ el: '#custom-theme-color-picker', parent: '#modal-settings-body', alpha: false, formatToggle: false });
        $("#modal-settings").on('show.bs.modal', updateThemeOptions.bind(document.getElementById('unit-theme')));
        $("#modal-settings").modal({ keyboard: false, focus: true, backdrop: 'static' });
        $("#modal-settings").find('#unit-theme').off('change').on('change', updateThemeOptions);

        $('#f-unit-settings').off('submit').on('submit', function (e) {
            e.preventDefault();
            model.update(Utils.toJSON(this));   // Overwrite indieauthor.model with the specified data
            $("#modal-settings").modal('hide'); // Hide the modal
            onSubmit && onSubmit(model);
        });

        $("#modal-settings .btn-submit").on('click', function () {
            $("#modal-settings input[type='submit']").trigger('click');
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

        if (Config.isRequestAdditionalDataOnPopulate())
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
        const encOption = Config.getEncryptionKey();
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
        const encOption = Config.getEncryptionKey();
        if (encOption === null)
            return new Promise(resolve => resolve(encrypted));

        const { default: CryptoJS } = await import('crypto-js');
        const key = typeof encOption === 'function' ? encOption() : encOption;
        return CryptoJS.AES.decrypt(encrypted, key).toString(CryptoJS.enc.Utf8);
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
    async importElement(id: string) {
        try {
            const encrypted: string | null = localStorage.getItem('copied-element');
            if (!encrypted) {
                localStorage.removeItem('copied-element');
                Utils.notifyWarning(this.i18n.value("messages.noElement"));
                return;
            }

            const decrypted = await this.decrypt(encrypted);
            const elementJSON = JSON.parse(decrypted);
            const modelElement = await ModelManager.create(elementJSON.widget, elementJSON);
            this.author.copyModelElement(modelElement, id);
            Utils.notifySuccess(this.i18n.value("messages.importedElement"));

        } catch (err) {
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.i18n.value("messages.noElement"));
        }
    }

    /**
     * Loads a given section from LocalStorage
     */
    async importSection() {
        try {
            const encrypted: string | null = localStorage.getItem('copied-section');
            if (!encrypted) {
                localStorage.removeItem('copied-section');
                Utils.notifyWarning(this.i18n.value("messages.noSection"));
                return;
            }
            const decrypted = await this.decrypt(encrypted);
            const sectionJSON = JSON.parse(decrypted);
            const sectionElement = await ModelManager.create(sectionJSON.widget, sectionJSON);
            this.author.copyModelSection(<Section>sectionElement);
            Utils.notifySuccess(this.i18n.value("messages.importedSection"));
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
    load(model: object, onLoaded?: Function, onError?: Function) {
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
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            fetch(Config.getSaveBackendURL(), requestOptions)
                .then(onGenerated)
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading();
                });
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
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            fetch(Config.getPreviewBackendURL(), requestOptions)
                .then(onGenerated)
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading();
                });
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
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json, application/octet-stream");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            fetch(Config.getScormBackendURL(), requestOptions)
                .then(self.onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading();
                });
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
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json, application/octet-stream");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            fetch(Config.getPublishBackendURL(), requestOptions)
                .then(self.onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.author.hideLoading();
                });
        }
        this.populateModel(onSubmit);
    }

    async translate() {
        // Check if the model is valid before trying to download
        if (!this.validate()) {
            console.error(this.i18n.translate("messages.contentErrors"));
            return;
        }

        const api = this;
        const { default: chooseLanguageTemplate } = await import("./views/translate.hbs");
        const model = this.author.model;
        const data = {
            languages: Api.ALLOWED_LANGUAGES,
            language: model.language ?? '',
        };
        // Create the form
        $('#modal-settings-tittle').html(this.i18n.value('dialog.translate'));
        $('#modal-settings-body').html(chooseLanguageTemplate(data));
        $("#modal-settings").modal({ keyboard: false, focus: true, backdrop: 'static' });

        $('#f-translate-unit').off('submit').on('submit', async function (e) {
            // Translate texts
            const srcInput = this.querySelector('#source-unit-language') as HTMLInputElement;
            const srcLang = srcInput.value;
            const tgtInput = this.querySelector('#target-unit-language') as HTMLInputElement;
            const tgtLang = tgtInput.value;
            e.preventDefault();
            $("#modal-settings").modal('hide');                    // Hide the modal
            api.author.showLoading();                              // Show loading modal
            const translated = await I18n.getInstance().translateOnDemand(JSON.stringify(model.getTexts()), srcLang ?? "EN", tgtLang);
            model.updateTexts(translated);
            // Update the language of the model
            model.language = tgtLang;           // Overwrite indieauthor.model with the specified data
            api.load(model.toJSON());           // Reload the model
        });

        $("#modal-settings .btn-submit").off('click').on('click', function () {
            $("#modal-settings input[type='submit']").trigger('click');
        });
    }
}