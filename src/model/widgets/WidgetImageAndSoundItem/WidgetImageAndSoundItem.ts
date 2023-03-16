/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetImageAndSoundItem extends WidgetSpecificItemElement {

    static widget = "ImageAndSoundItem";
    static category = "interactiveElements";
    static icon = icon;
    static paletteHidden = true;

    data: { text: string, alt: string, blob: string, audioblob: string, captionsblob: string }

    constructor(values?: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "", alt: "", blob: "", audioblob: "", captionsblob: "" };
    }

    clone(): WidgetImageAndSoundItem {
        const widget = new WidgetImageAndSoundItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            text: this.data.text,
            alt: this.data.alt,
            blob: this.data.blob,
            audioblob: this.data.audioblob,
            captionsblob: this.data.captionsblob
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ImageAndSoundItem.label")
        };
    }

    preview(): string {
        return this.data?.text ? this.data.text : this.translate("widgets.ImageAndSoundItem.prev");
    }

    settingsOpened(): void {
        let $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iBlob = $form.find('input[name=blob]');
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !this.data.blob);
        $iAudio.prop('required', !this.data.audioblob);
        $iCaptions.prop('required', !this.data.captionsblob);
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

        $iAudio.on('change', function () {
            const self = <HTMLInputElement>this;
            $iAudioBlob.val('');
            $iAudio.prop('required', true);
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $iAudio.prop('required', false);
                    $iAudioBlob.val(<string>value);
                });
            }
        });

        $iCaptions.on('change', function () {
            const self = <HTMLInputElement>this;
            $iCaptionsBlob.val('');
            $iCaptions.prop('required', true);
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $iCaptions.prop('required', false);
                    $iCaptionsBlob.val(<string>value);
                });
            }
        });
    }

    updateModelFromForm(form: any): void {
        this.data.audioblob = form.audioblob;
        this.data.captionsblob = form.captionsblob;
        this.data.blob = form.blob;
        this.data.text = form.text;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!Utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any) {
        var errors: string[] = [];
        if (!Utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob))
            errors.push("common.imageblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            errors.push("common.alt.invalid")
        return errors;
    }
}