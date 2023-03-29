/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetCorrectWordItemData } from "../../../types";
import WidgetCorrectWordItem from "./WidgetCorrectWordItem";

export default class WidgetLocalCorrectWordItem extends WidgetCorrectWordItem {

    static async create(values?: InputWidgetCorrectWordItemData): Promise<WidgetLocalCorrectWordItem> {
        if (!values?.data?.blob && values?.data?.image) {
            values.data.blob = await Utils.encodeURLAsBase64DataURL(values.data.image) as string;
            delete values.data.image;
        }
        return new WidgetLocalCorrectWordItem(values);
    }

    constructor(values?: InputWidgetCorrectWordItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", word: "", blob: "", alt: "" };
    }

    clone(): WidgetLocalCorrectWordItem {
        const widget = new WidgetLocalCorrectWordItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
        const data = {
            instanceId: this.id,
            question: this.data.question,
            word: this.data.word,
            blob: this.data.blob,
            alt: this.data.alt
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.CorrectWordItem.label")
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
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        return errors;
    }
}
