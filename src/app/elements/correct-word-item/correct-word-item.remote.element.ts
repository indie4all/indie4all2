/* global $ */
import "./styles.scss";
import { InputWidgetCorrectWordItemData } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import CorrectWordItemElement from "./correct-word-item.element";

export default class CorrectWordItemRemoteElement extends HasFilePickerElement(CorrectWordItemElement) {

    constructor() { super(); }

    async init(values?: InputWidgetCorrectWordItemData): Promise<void> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", word: "", image: "", alt: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                question: this.data.question,
                word: this.data.word,
                image: this.data.image,
                alt: this.data.alt
            }));
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', (e) => {
            $form.find('.preview-error').toggleClass('d-none', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (this.utils.isValidResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
        $preview.on('error', function () {
            const emptySrc = (this as HTMLImageElement).src === window.location.href;
            $form.find('.preview-error').toggleClass('d-none', emptySrc);
            $sectionPreview.toggleClass('d-none', true);
        });
        this.initFilePicker($iImg);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isValidResource(this.data.image)) errors.push("CorrectWordItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidResource(form.image)) errors.push("CorrectWordItem.image.invalid");
        return errors;
    }
}
