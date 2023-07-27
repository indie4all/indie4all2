import Config from "./Config";
import DragDropHandler from "./DragDropHandler";
import I18n from "./I18n";
import Utils from "./Utils";
import Category from "./category/Category";
import { Model } from "./model/Model";
import Author from "./modes/Author";
import "./styles/common-styles.scss";
import loadingTemplate from "./views/loading.hbs"
import settingsTemplate from "./views/modal-settings.hbs"
import previewGeneratedTemplate from "./views/preview-generated.hbs"
import netlifyUrlTemplate from "./views/netlify-url.hbs";

export default class GUI {

    private static GUI: GUI
    private static ALLOWED_LANGUAGES = ["AR", "BG", "CA", "CS", "DA", "DE", "EL", "EN", "ES", "ET", "EU", "FI",
        "FR", "GA", "GL", "HR", "HU", "IT", "JA", "LT", "LV", "MT", "NB", "NL",
        "PL", "PT", "RO", "SK", "SL", "SV", "UK", "YUE"];

    private container: HTMLElement;
    private palette: HTMLElement;
    private dragDropHandler: DragDropHandler;
    private author: Author;
    private i18n: I18n;
    private categories: Category[];

    static create(author: Author, palette: HTMLElement, container: HTMLElement, categories: Category[]): GUI {
        if (this.GUI) return this.getInstance();
        else {
            this.GUI = new GUI(author, palette, container, categories);
            return this.GUI;
        }

    }

    static getInstance(): GUI {
        return this.GUI;
    }

    private constructor(author: Author, palette: HTMLElement, container: HTMLElement, categories: Category[]) {
        this.author = author;
        this.container = container;
        this.palette = palette;
        this.categories = categories;
        this.i18n = I18n.getInstance();
        this.dragDropHandler = new DragDropHandler(palette, container, author.getModel());
        $(this.palette).append(categories.map(cat => cat.render()).join(''));
        // Initialize the widgets palette
        !$('#modal-loading').length && $(this.container).after(loadingTemplate());
        !$('#modal-settings').length && $(this.container).after(settingsTemplate());
        !$('#modal-preview-generated').length && $(this.container).after(previewGeneratedTemplate());
        !$('#modal-netlify-generated').length && $(this.container).after(netlifyUrlTemplate());
    }

    async openUnitSettings(title: string, onSubmit: Function) {

        await import("@melloware/coloris/dist/coloris.css");
        const { default: downloadTemplate } = await import("./views/download.hbs");
        const { default: Coloris } = await import("@melloware/coloris");
        const { default: themeManager } = await import('./themes/ThemeManager');
        const themes = themeManager.getThemes();
        themes.unshift("Custom");
        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 
        const licenses = ["PRIVATE", "BY", "BYSA", "BYND", "BYNC", "BYNCSA", "BYNCND"];
        const model = this.author.getModel();
        const data = {
            themes,
            languages: GUI.ALLOWED_LANGUAGES,
            licenses,
            title: model.title ?? '',
            user: model.user ?? '',
            email: model.email ?? '',
            institution: model.institution ?? '',
            language: model.language?.toUpperCase() ?? '',
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

    async openSettings(dataElementId: string) {

        const self = this;
        // 0 Clear older values
        $('#modal-settings-body').empty(); // clear the body
        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 

        // 1  get model from object
        const model = this.author.getModel();
        const modelElem = model.findObject(dataElementId);
        if (!modelElem) throw new Error('Could not locate the given element id');

        // 2 Populate the modal with the inputs of the widget
        modelElem.getInputs().then(modalContent => {
            // 3 Open the modal with values put
            $('#modal-settings-body').html(modalContent.inputs);
            $('#modal-settings-tittle').html(modalContent.title);
            $("#modal-settings").modal({ keyboard: false, focus: true, backdrop: 'static' });
            // 4 Associate functions to the modal
            const $form = $("#f-" + dataElementId);
            $form.append("<input type='submit' class='hide' />");
            $("#modal-settings-body").prepend('<div class="errors"></div>');

            $form.off('submit').on('submit', async function (e) {
                e.preventDefault();
                const formData = Utils.toJSON(this);
                const errors = model.validateFormElement(modelElem, formData);
                if (errors.length > 0) {
                    const { default: alertErrorTemplate } = await import("./views/alertError.hbs");
                    $("#modal-settings").animate({ scrollTop: 0 }, "slow");
                    const errorText = errors.map(error => self.i18n.translate("errors." + error)).join(". ")
                    $("#modal-settings-body .errors").html(alertErrorTemplate({ errorText }));
                    return;
                }

                modelElem.settingsClosed();
                $("#modal-settings").modal('hide');
                modelElem.updateModelFromForm(formData);
                const modelTemplate = document.querySelector('[data-id="' + modelElem.id + '"]');
                if (modelTemplate) {
                    modelTemplate.parentNode && $(modelTemplate.parentNode).removeClass('editor-error');
                    const previewElement = modelTemplate.querySelector('[data-prev]');
                    if (previewElement) {
                        previewElement.innerHTML = modelElem.preview();
                        // Clean errors
                        self.deleteToolTipError(<HTMLElement>previewElement);
                    }
                }
            });

            $("#modal-settings .btn-submit").on('click', function () {
                $form.find('input[type="submit"]').trigger('click');
            });

            // 5 Run when settings are opened
            modelElem.settingsOpened();
        });
    }

    async openTokenNetlifySettings(title: string, onSubmit: Function) {
        const { default: downloadTemplate } = await import("./views/netlify-token.hbs");
        const { default: optionsSitesTemplate } = await import("./views/netlify-sites-options.hbs");
        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event
        $('#modal-settings-tittle').html(title);
        $('#modal-settings-body').html(downloadTemplate());
        $("#modal-settings").modal({ keyboard: false, focus: true, backdrop: 'static' });
        const $tokenNetlify = $("#token-netlify");
        const $confirmToken = $("#confirm-token");
        $("#modal-settings .btn-submit").on('click', function (e) {
            if ($("#select-sites").val() == undefined) {
                e.preventDefault();
            }
            else {
                $("#modal-settings input[type='submit']").trigger('click');
            }
        });
        $("#f-netlify-settings").on('submit', function (e) {
            e.preventDefault();
            $("#modal-settings").modal('hide');
            setTimeout(function () {
                onSubmit($tokenNetlify.val(), $("#select-sites").val(), $("#select-sites option:selected").text());
            }, 1000);
        });

        $confirmToken.on('click', function () {
            const token = $tokenNetlify.val();
            const urls = [];
            const sites_id = [];
            fetch('https://api.netlify.com/api/v1/sites', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok) return response.json();
                    else return Promise.reject(response);
                })
                .then(response => {
                    for (let json of response) {
                        urls.push(json.url);
                        sites_id.push(json.site_id);
                    }
                    const data = {
                        urls: urls,
                        ids: sites_id,
                        incorrectToken: false
                    }
                    $("#div-sites").html(optionsSitesTemplate(data))
                    $("#div-sites").removeClass("d-none");
                })
                .catch(error => {
                    const data = {
                        urls: urls,
                        ids: sites_id,
                        incorrectToken: true
                    }
                    $("#div-sites").html(optionsSitesTemplate(data))
                    $("#div-sites").removeClass("d-none");

                })
        });
    }

    showLoading(title?: string, message?: string) {
        const $modal = $('#modal-loading');
        $modal.find('#modal-loading-title').html(title ?? this.i18n.value("common.loading.title"));
        $modal.find('#modal-loading-description').html(message ?? this.i18n.value("common.loading.description"));
        $modal.modal({ keyboard: false, backdrop: 'static' });
    }

    hideLoading() { $('#modal-loading').modal('hide'); }

    showErrors(currentErrors: { element: string, keys: string[] }[], newErrors: { element: string, keys: string[] }[]) {

        // Remove previous errors
        currentErrors
            .map(error => document.querySelector("[data-id='" + error.element + "']"))
            .filter(elem => elem !== null)
            .forEach(elem => {
                this.deleteToolTipError(elem.querySelector('[data-prev]'));
                $(elem.parentNode).removeClass('editor-error');
            });

        // Show new errors
        newErrors
            .forEach(error => {
                const element = document.querySelector("[data-id='" + error.element + "']");
                if (element) {
                    element.parentNode && $(element.parentNode).addClass('editor-error');
                    const preview = <HTMLElement>element.querySelector('[data-prev]');
                    if (preview) {
                        const title = error.keys
                            .map(key => this.i18n.value("errors." + key))
                            .join(" ");
                        this.creatToolTipError(title, preview);
                    }
                }
            });
    }

    showGeneralError(key: string) {
        Utils.notifyError(this.i18n.value(key));
    }

    showSuccess(key: string) {
        Utils.notifySuccess(this.i18n.value(key));
    }

    /**
     * Populates a model to a server, optionally showing a modal for requesting additional information
     * @param {string} title - Title of the modal window
     * @param {Function} onSubmit - Action to perform when the model is ready to be populated
     */
    populateModel(onSubmit: Function) {

        // Check if the model is valid before trying to download
        if (!this.author.validateContent()) {
            const { currentErrors, newErrors } = this.author.getModelErrors();
            this.showErrors(currentErrors, newErrors);
            console.error(this.i18n.translate("messages.contentErrors"));
            return;
        }

        if (Config.isRequestAdditionalDataOnPopulate())
            this.openUnitSettings(this.i18n.value(`common.unit.settings`), onSubmit);
        else
            onSubmit && onSubmit(this.author.getModel());
    }

    deleteToolTipError(previewElement: HTMLElement) {
        delete previewElement.dataset.title;
        delete previewElement.dataset['originalTitle'];
        previewElement.removeEventListener('mouseenter', () => $(previewElement).tooltip('show'));
        previewElement.removeEventListener('mouseout', () => $(previewElement).tooltip('hide'));
        $(previewElement).tooltip('dispose');
    }

    creatToolTipError(title: string, previewElement: HTMLElement) {
        previewElement.dataset.title = title;
        previewElement.dataset['originalTitle'] = title;
        previewElement.addEventListener('mouseenter', () => $(previewElement).tooltip('show'));
        previewElement.addEventListener('mouseleave', () => $(previewElement).tooltip('hide'));
    }

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
     * Loads a model into the application
     * @param {object} model - The model to be loaded
     * @param {Function} onLoaded - Event to trigger when the model has been loaded
     * @param {Function} onError - Event to trigger when there has been an error
     */
    load(onLoaded?: Function, onError?: Function) {
        const self = this;
        this.showLoading();
        $(self.container).hide(1000, async function () {
            try {
                $(self.container).empty();
                self.dragDropHandler.setModel(self.author.getModel());
                $(self.container).append(self.author.getModel().sections.map(section => section.createElement()).join(''));
                $(self.container).show(1000, () => {
                    self.hideLoading();
                    onLoaded && onLoaded();
                });
            } catch (err) {
                console.error(err);
                $(self.container).empty();
                setTimeout(() => self.hideLoading(), 1000);
                self.author.resetModel();
                Utils.notifyError(self.i18n.value("messages.loadError"));
                onError && onError(err);
            }
        });
    }

    save() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.save.title");
            const description = this.i18n.value("common.save.description");
            self.showLoading(title, description);
            const onGenerated = async (response: Response) => {
                // Wait until the modal is fully loaded (1 sec)
                setTimeout(() => self.hideLoading(), 1000);
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
                    self.hideLoading();
                });
        };
        this.populateModel(onSubmit);
    }

    scorm() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.scorm.title");
            const description = this.i18n.value("common.scorm.description");
            self.showLoading(title, description);
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json, application/octet-stream");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            fetch(Config.getScormBackendURL(), requestOptions)
                .then(self.onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.hideLoading();
                });
        }
        this.populateModel(onSubmit);
    }

    download() {
        const self = this;
        const onSubmit = (model: Model) => {
            const file = new File([JSON.stringify(model, null, 2)], "model.json", { type: "application/json" });
            self.downloadFile(file);
        };
        this.populateModel(onSubmit);
    }

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

    publish() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.publish.title");
            const description = this.i18n.value("common.publish.description");
            self.showLoading(title, description);
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json, application/octet-stream");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            fetch(Config.getPublishBackendURL(), requestOptions)
                .then(self.onPublishModel.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.hideLoading();
                });
        }
        this.populateModel(onSubmit);
    }

    private onPublishModel(response: Response) {
        const self = this;
        if (!response.ok) {
            // Wait until the modal is fully loaded (1 sec)
            setTimeout(() => self.hideLoading(), 1000);
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
                self.hideLoading();
                resolve();
            });
        });
    }

    publishToNetlify() {
        const self = this;

        const onSubmitSettings = (token: string, site_id: string, site_url: string, model: Model) => {
            const title = this.i18n.value("common.publishToNetlify.title");
            const description = this.i18n.value("common.publishToNetlify.description");
            self.showLoading(title, description);
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");

            const requestOptions = { method: 'POST', body: JSON.stringify({ token, site_id, site_url, model }), headers };
            fetch(Config.getPublishToNetlifyBackendURL(), requestOptions)
                .then(self.onPublishModelToNetlify.bind(self))
                .catch(error => {
                    console.log('error', error);
                    self.hideLoading();
                });
        }
        // Check if the model is valid before trying to download
        if (!this.author.validateContent()) {
            console.error(this.i18n.translate("messages.contentErrors"));
            return;
        }
        if (Config.isRequestAdditionalDataOnPopulate()) {
            const onSubmitToken = (token: string, site_id: string, site_url: string) => {
                this.openUnitSettings(this.i18n.value(`common.unit.settings`), onSubmitSettings.bind(this, token, site_id, site_url));
            };
            this.openTokenNetlifySettings(this.i18n.value(`netlify.config.title`), onSubmitToken);
        }
    }

    private async onPublishModelToNetlify(response: Response) {
        const self = this;
        if (!response.ok) {
            // Wait until the modal is fully loaded (1 sec)
            setTimeout(() => self.hideLoading(), 1000);
            Utils.notifyError(this.i18n.value("messages.publishError"));
            return;
        }

        // Wait until the modal is fully loaded (1 sec)
        setTimeout(() => self.hideLoading(), 1000);
        if (!response.ok) {
            Utils.notifyError(this.i18n.value("messages.previewError"));
            return;
        }
        const json = await response.json();
        $('#modal-netlify-generated-url').html(json.url);
        $('#modal-netlify-generated-url').attr('href', json.url);
        $('#modal-netlify-generated').modal({ backdrop: true });
    }

    preview() {
        const self = this;
        const onSubmit = (model: Model) => {
            const title = this.i18n.value("common.preview.title");
            const description = this.i18n.value("common.preview.description");
            self.showLoading(title, description);
            const onGenerated = async (response: Response) => {
                // Wait until the modal is fully loaded (1 sec)
                setTimeout(() => self.hideLoading(), 1000);
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
                    self.hideLoading();
                });
        }
        self.populateModel(onSubmit);
    }

    async translate(model: Model) {
        // Check if the model is valid before trying to download
        const api = this;
        const { default: chooseLanguageTemplate } = await import("./views/translate.hbs");
        const data = {
            languages: GUI.ALLOWED_LANGUAGES,
            language: model.language?.toUpperCase() ?? '',
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
            api.showLoading();                              // Show loading modal
            try {
                const translated = await I18n.getInstance().translateOnDemand(JSON.stringify(model.getTexts()), srcLang ?? "EN", tgtLang);
                model.updateTexts(translated);
                // Update the language of the model
                model.language = tgtLang;           // Overwrite indieauthor.model with the specified data
                // TODO: redesign this
                await api.author.loadModelIntoPlugin(model.toJSON());
                api.load();
                // Reload the model
            } catch (error) {
                console.error(error);
                Utils.notifyError(error.message);
                setTimeout(() => api.hideLoading(), 1000);
            }
        });

        $("#modal-settings .btn-submit").off('click').on('click', function () {
            $("#modal-settings input[type='submit']").trigger('click');
        });
    }

    getContainer(): HTMLElement {
        return this.container;
    }

    renderCategories(categories: Category[]) {
        this.categories = categories;
        $(this.palette).append(categories.map(cat => cat.render()).join(''));
    }

    toggleCategory(category: string) {
        const cat = this.categories.find(cat => cat.name === category);
        cat && cat.toggle();
    }


}
