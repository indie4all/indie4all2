/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetButtonTextItemData } from "../../../types";
import WidgetButtonTextItem from "./WidgetButtonTextItem";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteButtonTextItem extends HasFilePickerElement(WidgetButtonTextItem) {

    static async create(values?: InputWidgetButtonTextItemData): Promise<WidgetRemoteButtonTextItem> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        return new WidgetRemoteButtonTextItem(values);
    }

    constructor(values?: InputWidgetButtonTextItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "", image: "", alt: "" };
    }

    clone(): WidgetRemoteButtonTextItem {
        const widget = new WidgetRemoteButtonTextItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        const data = {
            instanceId: this.id,
            image: this.data.image,
            alt: this.data.alt,
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ButtonTextItem.label")
        };
    }

    settingsOpened() {
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', function (e) {
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
        if (!Utils.isValidResource(this.data.image)) errors.push("ButtonTextItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidResource(form.image)) errors.push("ButtonTextItem.image.invalid");
        return errors;
    }
}