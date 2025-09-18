/* global $ */
import "./styles.scss";
import { InputWidgetCorrectWordItemData, WidgetInitOptions } from "../../../types";
import CorrectWordItemElement from "./correct-word-item.element";

export default class CorrectWordItemLocalElement extends CorrectWordItemElement {

    constructor() { super(); }

    async init(values?: InputWidgetCorrectWordItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = this.utils.resourceURL(values.data.image);
            values.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { question: "", word: "", blob: "", alt: "" };
    }

    get form() {
        return import('./form-local.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                question: this.data.question,
                word: this.data.word,
                blob: this.data.blob,
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
