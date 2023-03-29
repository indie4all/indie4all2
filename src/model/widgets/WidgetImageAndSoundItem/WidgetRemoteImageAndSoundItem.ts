/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetImageAndSoundItemData } from "../../../types";
import WidgetImageAndSoundItem from "./WidgetImageAndSoundItem";

export default class WidgetRemoteImageAndSoundItem extends WidgetImageAndSoundItem {

    static async create(values?: InputWidgetImageAndSoundItemData): Promise<WidgetRemoteImageAndSoundItem> {
        // TODO Local to remote resources
        if (!values?.data?.captions && values?.data?.captionsblob)
            throw new Error("Conversion from Local to Remote is not currently supported");
        if (!values?.data?.audio && values?.data?.audioblob)
            throw new Error("Conversion from Local to Remote is not currently supported");
        if (!values?.data?.image && values?.data?.blob)
            throw new Error("Conversion from Local to Remote is not currently supported");
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
            if (Utils.isIndieResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
    }

    updateModelFromForm(form: any): void {
        this.data.audio = form.audio;
        this.data.captions = form.captions;
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isIndieResource(this.data.audio))
            errors.push("ImageAndSoundItem.audio.invalid");
        if (!Utils.isIndieResource(this.data.image))
            errors.push("ImageAndSoundItem.image.invalid");
        if (!Utils.isStringEmptyOrWhitespace(this.data.captions) && !Utils.isIndieResource(this.data.captions))
            errors.push("common.captions.invalid");
        return errors;
    }

    validateForm(form: any) {
        const errors = super.validateForm(form);
        if (!Utils.isIndieResource(form.audio))
            errors.push("ImageAndSoundItem.audio.invalid");
        if (!Utils.isIndieResource(form.image))
            errors.push("ImageAndSoundItem.image.invalid");
        if (!Utils.isStringEmptyOrWhitespace(form.captions) && !Utils.isIndieResource(form.captions))
            errors.push("common.captions.invalid");
        return errors;
    }
}