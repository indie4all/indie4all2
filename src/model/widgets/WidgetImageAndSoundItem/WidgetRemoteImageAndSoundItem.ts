/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetImageAndSoundItemData } from "../../../types";
import WidgetImageAndSoundItem from "./WidgetImageAndSoundItem";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteImageAndSoundItem extends HasFilePickerElement(WidgetImageAndSoundItem) {

    static async create(values?: InputWidgetImageAndSoundItemData): Promise<WidgetRemoteImageAndSoundItem> {
        // TODO Local to remote resources
        if (!values?.data?.captions && values?.data?.captionsblob) {
            const url = await Utils.base64DataURLToURL(values.data.captionsblob);
            values.data.captions = url;
            delete values.data.captionsblob;
            //throw new Error("Conversion from Local to Remote is not currently supported");
        }

        if (!values?.data?.audio && values?.data?.audioblob) {
            const url = await Utils.base64DataURLToURL(values.data.audioblob);
            values.data.audio = url;
            delete values.data.audioblob;
            //throw new Error("Conversion from Local to Remote is not currently supported");
        }
        if (!values?.data?.image && values?.data?.blob) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
            // throw new Error("Conversion from Local to Remote is not currently supported");
        }
        return new WidgetRemoteImageAndSoundItem(values);
    }

    constructor(values?: InputWidgetImageAndSoundItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "", alt: "", image: "", audio: "", captions: "" };
    }

    clone(): WidgetRemoteImageAndSoundItem {
        const widget = new WidgetRemoteImageAndSoundItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        var data = {
            instanceId: this.id,
            text: this.data.text,
            alt: this.data.alt,
            image: this.data.image,
            audio: this.data.audio,
            captions: this.data.captions
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ImageAndSoundItem.label")
        };
    }

    settingsOpened() {
        let $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $sectionPreview.toggleClass('d-none', !this.data.image);
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
        this.initFilePicker($form.find('input[name="audio"]'));
        this.initFilePicker($form.find('input[name="captions"]'));
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.audio = form.audio;
        this.data.captions = form.captions;
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isValidResource(this.data.audio))
            errors.push("ImageAndSoundItem.audio.invalid");
        if (!Utils.isValidResource(this.data.image))
            errors.push("ImageAndSoundItem.image.invalid");
        if (!Utils.isStringEmptyOrWhitespace(this.data.captions) && !Utils.isValidResource(this.data.captions))
            errors.push("common.captions.invalid");
        return errors;
    }

    validateForm(form: any) {
        const errors = super.validateForm(form);
        if (!Utils.isValidResource(form.audio))
            errors.push("ImageAndSoundItem.audio.invalid");
        if (!Utils.isValidResource(form.image))
            errors.push("ImageAndSoundItem.image.invalid");
        if (!Utils.isStringEmptyOrWhitespace(form.captions) && !Utils.isValidResource(form.captions))
            errors.push("common.captions.invalid");
        return errors;
    }
}