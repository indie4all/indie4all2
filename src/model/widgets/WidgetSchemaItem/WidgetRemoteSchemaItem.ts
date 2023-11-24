/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetSchemaItemData } from "../../../types";
import WidgetSchemaItem from "./WidgetSchemaItem";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteSchemaItem extends HasFilePickerElement(WidgetSchemaItem) {

    static async create(values?: InputWidgetSchemaItemData): Promise<WidgetRemoteSchemaItem> {
        // TODO Local to remote resources
        if (values?.data?.blob && !values?.data?.image) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        return new WidgetRemoteSchemaItem(values);
    }

    constructor(values?: InputWidgetSchemaItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { image: "", alt: "" };
    }

    clone(): WidgetSchemaItem {
        const widget = new WidgetRemoteSchemaItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        const data = {
            instanceId: this.id,
            alt: this.data.alt,
            image: this.data.image
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.SchemaItem.label")
        };
    }

    settingsOpened(): void {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', function (e) {
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (Utils.isValidResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
        this.initFilePicker($iImg);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isValidResource(this.data.image))
            errors.push("SchemaItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidResource(form.image))
            errors.push("SchemaItem.image.invalid");
        return errors;
    }
}