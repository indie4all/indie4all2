/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetSchemaItemData } from "../../../types";
import WidgetSchemaItem from "./WidgetSchemaItem";

export default class WidgetLocalSchemaItem extends WidgetSchemaItem {

    static async create(values?: InputWidgetSchemaItemData): Promise<WidgetLocalSchemaItem> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = Utils.resourceURL(values.data.image);
            values.data.blob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        return new WidgetLocalSchemaItem(values);
    }

    constructor(values?: InputWidgetSchemaItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { blob: "", alt: "" };
    }

    clone(): WidgetLocalSchemaItem {
        const widget = new WidgetLocalSchemaItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
        const data = {
            instanceId: this.id,
            alt: this.data.alt,
            blob: this.data.blob
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.SchemaItem.label")
        };
    }

    settingsOpened(): void {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !this.data.blob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);
        $iImg.on('change', function () {
            const self = <HTMLInputElement>this;
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
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
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidBase64DataUrl(form.blob))
            errors.push("common.imageblob.invalid");
        return errors;
    }
}