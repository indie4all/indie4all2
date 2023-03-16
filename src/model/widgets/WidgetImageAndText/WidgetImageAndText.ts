/* global $ */
import Utils from "../../../Utils";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetImageAndText extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "ImageAndText";
    static category = "interactiveElements";
    static icon = icon;

    params: { name: string, help: string }
    data: { text: string, blob: string, layout: number, alt: string }

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Text-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", layout: 0, alt: "" };
    }

    clone(): WidgetImageAndText {
        const widget = new WidgetImageAndText();
        widget.params = structuredClone(this.params);
        widget.params.name = "Image and Text-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            blob: this.data.blob,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ImageAndText.label")
        };
    }

    settingsOpened(): void {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        const editorElement = $form.find('.texteditor');
        this.initTextEditor(this.data.text, editorElement);
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
        return this.params?.name ?? this.translate("widgets.ImageAndText.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.text = this.clearAndSanitizeHtml(form.textblockText);
        this.data.blob = form.blob;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(this.data.text)) errors.push("ImageAndText.text.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.textblockText.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(form.textblockText)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
