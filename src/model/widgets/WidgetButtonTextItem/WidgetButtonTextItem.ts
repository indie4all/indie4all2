/* global $ */
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";

export default class WidgetButtonTextItem extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "ButtonTextItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-button-text-item";
    static paletteHidden = true;

    data: { text: string, blob: string, alt: string }

    constructor(values: any) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", alt: "" };
    }

    clone(): WidgetButtonTextItem {
        return new WidgetButtonTextItem(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            blob: this.data.blob,
            alt: this.data.alt,
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ButtonTextItem.label")
        };
    }

    preview(): string {
        return this.data?.alt ? this.data.alt : this.translate("widgets.ButtonTextItem.prev");
    }

    settingsOpened(): void {
        let $editor = $('#f-' + this.id + ' .texteditor');
        this.initTextEditor(this.data.text, $editor);
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
        this.data.text = this.clearAndSanitizeHtml(form.text);
        this.data.blob = form.blob;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(this.data.text)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(form.text)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }

}