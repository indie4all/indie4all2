/* global $ */
import "./styles.scss";
import { InputWidgetButtonTextItemData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import ButtonTextItemElement from "./button-text-item.element";

export default class ButtonTextItemRemoteElement extends HasFilePickerElement(ButtonTextItemElement) {

    constructor() { super(); }

    async init(values?: InputWidgetButtonTextItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { text: "", image: "", alt: "" };
    }

    get form() {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                image: this.data.image,
                alt: this.data.alt
            }));
    }

    settingsOpened() {
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', (e) => {
            $form.find('.preview-error').toggleClass('d-none', true);
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
        if (!this.utils.isValidResource(this.data.image)) errors.push("ButtonTextItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidResource(form.image)) errors.push("ButtonTextItem.image.invalid");
        return errors;
    }
}