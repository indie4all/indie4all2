/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetCorrectWordItemData } from "../../../types";
import WidgetCorrectWordItem from "./WidgetCorrectWordItem";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteCorrectWordItem extends HasFilePickerElement(WidgetCorrectWordItem) {

    static async create(values?: InputWidgetCorrectWordItemData): Promise<WidgetRemoteCorrectWordItem> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        return new WidgetRemoteCorrectWordItem(values);
    }

    constructor(values?: InputWidgetCorrectWordItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", word: "", image: "", alt: "" };
    }

    clone(): WidgetRemoteCorrectWordItem {
        const widget = new WidgetRemoteCorrectWordItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        var data = {
            instanceId: this.id,
            question: this.data.question,
            word: this.data.word,
            image: this.data.image,
            alt: this.data.alt
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.CorrectWordItem.label")
        };
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', function (e) {
            $form.find('.preview-error').toggleClass('d-none', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (Utils.isValidResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
        $preview.on('error', function () {
            const emptySrc = (this as HTMLImageElement).src === window.location.origin + '/';
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
        if (!Utils.isValidResource(this.data.image)) errors.push("CorrectWordItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidResource(form.image)) errors.push("CorrectWordItem.image.invalid");
        return errors;
    }
}
