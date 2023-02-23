/* global $ */
import Utils from "../../../Utils";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetImage extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "Image";
    static type = "element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-image";

    params: { name: string, help: string }
    data: { text: string, blob: string, alt: string }

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetImage.widget + "-" + this.id,
            help: "",
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", alt: "" };
    }

    clone(): WidgetImage {
        const widget = new WidgetImage();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetImage.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt,
            text: this.data.text,
            blob: this.data.blob
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.Image.label")
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

        var editorElement = $form.find('.texteditor');
        this.initTextEditor(this.data.text, editorElement);

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
        return this.params?.name ?? this.translate("widgets.Image.prev")
    }

    updateModelFromForm(form: any): void {
        // TODO:
        this.data.text = this.clearAndSanitizeHtml(form.text);
        this.data.blob = form.blob;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            keys.push("common.imageblob.invalid");
        if (!this.data.text || (this.data.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(this.data.text))
            keys.push("TextBlock.text.invalid");
        if (!Utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            keys.push("common.alt.invalid")
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (!Utils.isValidBase64DataUrl(form.blob))
            keys.push("common.imageblob.invalid");
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        if (!form.text || (form.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(form.text))
            keys.push("TextBlock.text.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            keys.push("common.alt.invalid")
        return keys;
    }
}