/* global $ */
import "./styles.scss";
import { InputWidgetImageAndTextData, WidgetInitOptions } from "../../../types";
import ImageTextElement from "./image-text.element";

export default class ImageTextLocalElement extends ImageTextElement {

    constructor() { super(); }

    async init(values?: InputWidgetImageAndTextData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = this.utils.resourceURL(values.data.image);
            values.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Text-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Image and Text-" + this.id
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", layout: 0, alt: "" };
    }

    get form(): Promise<string> {
        return import('./form-local.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                blob: this.data.blob,
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
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
        $iImg.prop('required', !this.data.blob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);
        $iImg.on('change', () => {
            const self = $iImg[0] as HTMLInputElement;
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
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
