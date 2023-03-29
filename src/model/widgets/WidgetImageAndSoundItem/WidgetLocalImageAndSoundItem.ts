/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetImageAndSoundItemData } from "../../../types";
import WidgetImageAndSoundItem from "./WidgetImageAndSoundItem";

export default class WidgetLocalImageAndSoundItem extends WidgetImageAndSoundItem {

    static async create(values?: InputWidgetImageAndSoundItemData): Promise<WidgetLocalImageAndSoundItem> {
        if (!values?.data?.audioblob && values?.data?.audio) {
            const url = Utils.resourceURL(values.data.audio);
            values.data.audioblob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.audio;
        }
        if (!values?.data?.captionsblob && values?.data?.captions) {
            const url = Utils.resourceURL(values.data.captions);
            values.data.captionsblob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.captions;
        }
        if (!values?.data?.blob && values?.data?.image) {
            const url = Utils.resourceURL(values.data.image);
            values.data.blob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        return new WidgetLocalImageAndSoundItem(values);
    }

    constructor(values?: InputWidgetImageAndSoundItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "", alt: "", blob: "", audioblob: "", captionsblob: "" };
    }

    clone(): WidgetLocalImageAndSoundItem {
        const widget = new WidgetLocalImageAndSoundItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
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
        super.updateModelFromForm(form);
        this.data.audioblob = form.audioblob;
        this.data.captionsblob = form.captionsblob;
        this.data.blob = form.blob;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        return errors;
    }

    validateForm(form: any) {
        const errors = super.validateForm(form);
        if (!Utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob))
            errors.push("common.imageblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        return errors;
    }
}