/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetImageData } from "../../../types";
import WidgetImage from "./WidgetImage";

export default class WidgetLocalImage extends WidgetImage {

    static async create(values?: InputWidgetImageData): Promise<WidgetLocalImage> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = Utils.resourceURL(values.data.image);
            values.data.blob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        return new WidgetLocalImage(values);
    }

    constructor(values?: InputWidgetImageData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetLocalImage.widget + "-" + this.id,
            help: "",
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", blob: "", alt: "" };
    }

    clone(): WidgetLocalImage {
        const widget = new WidgetLocalImage();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetLocalImage.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
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
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');

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
        const keys = super.validateModel();
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            keys.push("common.imageblob.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        const keys = super.validateForm(form);
        if (!Utils.isValidBase64DataUrl(form.blob))
            keys.push("common.imageblob.invalid");
        return keys;
    }
}