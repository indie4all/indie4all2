/* global $ */
import "./styles.scss";
import { InputWidgetSchemaItemData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import SchemaItemElement from "./schema-item.element";
import { FilePickerType } from "../../services/file-picker/types";

export default class SchemaItemRemoteElement extends HasFilePickerElement(SchemaItemElement) {

    constructor() { super(); }

    async init(values?: InputWidgetSchemaItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { image: "", alt: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            alt: this.data.alt,
            image: this.data.image
        }));
    }

    settingsOpened(): void {
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
        this.initFilePicker($iImg, FilePickerType.IMAGE);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isValidResource(this.data.image))
            errors.push("SchemaItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidResource(form.image))
            errors.push("SchemaItem.image.invalid");
        return errors;
    }
}