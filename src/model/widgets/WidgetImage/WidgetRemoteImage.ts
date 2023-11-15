/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetImageData } from "../../../types";
import WidgetImage from "./WidgetImage";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteImage extends HasFilePickerElement(WidgetImage) {

    static async create(values?: InputWidgetImageData): Promise<WidgetRemoteImage> {
        if (!values?.data?.image && values?.data?.blob) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        return new WidgetRemoteImage(values);
    }

    constructor(values?: InputWidgetImageData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetRemoteImage.widget + "-" + this.id,
            help: "",
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", image: "", alt: "" };
    }

    clone(): WidgetRemoteImage {
        const widget = new WidgetRemoteImage();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetRemoteImage.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt,
            text: this.data.text,
            image: this.data.image
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.Image.label")
        };
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
        $iImg.on('change', function (e) {
            $preview.attr('src', '');
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
        const keys = super.validateModel();
        if (!Utils.isValidResource(this.data.image))
            keys.push("Image.image.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        const keys = super.validateForm(form);
        if (!Utils.isValidResource(form.image))
            keys.push("Image.image.invalid");
        return keys;
    }
}