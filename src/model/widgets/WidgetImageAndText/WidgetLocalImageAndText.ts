/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetImageAndTextData } from "../../../types";
import WidgetImageAndText from "./WidgetImageAndText";

export default class WidgetLocalImageAndText extends WidgetImageAndText {

    static async create(values?: InputWidgetImageAndTextData): Promise<WidgetLocalImageAndText> {
        if (!values?.data?.blob && values?.data?.image) {
            values.data.blob = await Utils.encodeURLAsBase64DataURL(values.data.image) as string;
            delete values.data.image;
        }
        return new WidgetLocalImageAndText(values);
    }

    constructor(values?: InputWidgetImageAndTextData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Text-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", layout: 0, alt: "" };
    }

    clone(): WidgetLocalImageAndText {
        const widget = new WidgetLocalImageAndText();
        widget.params = structuredClone(this.params);
        widget.params.name = "Image and Text-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
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
