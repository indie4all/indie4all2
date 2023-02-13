/* global $ */
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetButtonTextItem extends WidgetItemElement {

    static widget = "ButtonTextItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-button-text-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", alt: "" };
    }

    clone() {
        return new WidgetButtonTextItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                blob: this.data.blob,
                alt: this.data.alt,
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.ButtonTextItem.label")
            };
        });
    }

    preview() {
        return this.data?.alt ? this.data.alt : this.translate("widgets.ButtonTextItem.prev");
    }

    settingsOpened() {
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
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                    $preview.attr('src', value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });
    }

    updateModelFromForm(form) {
        this.data.text = this.clearAndSanitizeHtml(form.text);
        this.data.blob = form.blob;
        this.data.alt = form.alt;
    }

    validateModel() {
        var errors = [];
        if (this.data.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(this.data.text)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(form.text)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }

}