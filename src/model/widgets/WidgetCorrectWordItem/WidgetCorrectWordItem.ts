/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetCorrectWordItem extends WidgetItemElement {

    static widget = "CorrectWordItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-correct-word-item";
    static paletteHidden = true;

    data: { question: string, word: string, blob: string, alt: string }

    constructor(values: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", word: "", blob: "", alt: "" };
    }

    clone(): WidgetCorrectWordItem {
        return new WidgetCorrectWordItem(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
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

    preview(): string {
        return (this.data?.question && this.data?.word) ?
            (this.data.question + " -> " + this.data.word) : this.translate("widgets.CorrectWordItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.question = form.question;
        this.data.blob = form.blob;
        this.data.word = form.word;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.question))
            errors.push("CorrectWordItem.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.word))
            errors.push("CorrectWordItem.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.question)) errors.push("formData.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.word)) errors.push("formData.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid");
        return errors;
    }
}
