/* global $ */
import "./styles.scss";
import { InputWidgetChooseOptionData, WidgetInitOptions } from "../../../types";
import ChooseOptionElement from "./choose-option.element";

export default class ChooseOptionLocalElement extends ChooseOptionElement {

    constructor() { super(); }

    async init(values?: InputWidgetChooseOptionData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = this.utils.resourceURL(values.data.image);
            values.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Choose option-" + this.id,
            help: "",
        };
        if (options.regenerateId) this.params.name = "Choose option-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : {
            text: "", blob: "", alt: "",
            options: [
                { text: "", correct: false }, { text: "", correct: false },
                { text: "", correct: false }, { text: "", correct: false }
            ]
        }
    }

    get form() {
        // Create an array of size 8 initialized with the current options or empty strings
        const options = Array.from({ length: ChooseOptionElement.optionsNumber }, (_, i) => {
            return {
                text: this.data.options[i] ? this.data.options[i].text : "",
                correct: this.data.options[i] ? this.data.options[i].correct : false,
        }});
        return import('./form-local.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                text: this.data.text,
                blob: this.data.blob,
                options: options,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt
            }));
    }

    settingsOpened(): void {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        $iImg.prop('required', !this.data.blob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);

        $iImg.on('change', () => {
            const self = $iImg[0] as HTMLInputElement;
            $sectionPreview.toggleClass('d-none', true);
            $iImg.prop('required', true);
            $iBlob.val('');
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(<string>value);
                    $preview.attr('src', <string>value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.blob = form.blob;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        return errors;
    }
}
