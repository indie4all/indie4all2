/* global $ */
import "./styles.scss";
import { InputWidgetSchemaItemData, WidgetInitOptions } from "../../../types";
import SchemaItemElement from "./schema-item.element";

export default class SchemaItemLocalElement extends SchemaItemElement {

    constructor() { super(); }

    async init(values?: InputWidgetSchemaItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!this.data.blob && this.data.image) {
            const url = this.utils.resourceURL(this.data.image);
            this.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete this.data.image;
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { blob: "", alt: "" };
    }

    get form(): Promise<string> {
        return import('./form-local.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            alt: this.data.alt,
            blob: this.data.blob
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
        if (!this.utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidBase64DataUrl(form.blob))
            errors.push("common.imageblob.invalid");
        return errors;
    }
}