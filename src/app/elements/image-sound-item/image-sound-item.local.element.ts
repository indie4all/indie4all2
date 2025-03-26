/* global $ */
import "./styles.scss";
import { InputWidgetImageAndSoundItemData, WidgetInitOptions } from "../../../types";
import ImageSoundItemElement from "./image-sound-item.element";

export default class ImageSoundItemLocalElement extends ImageSoundItemElement {

    constructor() { super(); }

    async init(values?: InputWidgetImageAndSoundItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.audioblob && values?.data?.audio) {
            const url = this.utils.resourceURL(values.data.audio);
            values.data.audioblob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.audio;
        }
        if (!values?.data?.captionsblob && values?.data?.captions) {
            const url = this.utils.resourceURL(values.data.captions);
            values.data.captionsblob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.captions;
        }
        if (!values?.data?.blob && values?.data?.image) {
            const url = this.utils.resourceURL(values.data.image);
            values.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { text: "", alt: "", blob: "", audioblob: "", captionsblob: "" };
    }

    get form(): Promise<string> {
        return import('./form-local.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                text: this.data.text,
                alt: this.data.alt,
                blob: this.data.blob,
                audioblob: this.data.audioblob,
                captionsblob: this.data.captionsblob
            }));
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
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        $iImg.prop('required', !this.data.blob);
        $iAudio.prop('required', !this.data.audioblob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);
        $iImg.on('change', () => {
            const self = $iImg[0] as HTMLInputElement;
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(<string>value);
                    $preview.attr('src', <string>value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });

        $iAudio.on('change', () => {
            const self = $iAudio[0] as HTMLInputElement;
            $iAudioBlob.val('');
            $iAudio.prop('required', true);
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $iAudio.prop('required', false);
                    $iAudioBlob.val(<string>value);
                });
            }
        });

        $iCaptions.on('change', () => {
            const self = $iCaptions[0] as HTMLInputElement;
            $iCaptionsBlob.val('');
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
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
        if (!this.utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        if (!this.utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        if (this.data.captionsblob && !this.utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        return errors;
    }

    validateForm(form: any) {
        const errors = super.validateForm(form);
        if (!this.utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        if (!this.utils.isValidBase64DataUrl(form.blob))
            errors.push("common.imageblob.invalid");
        if (form.captionsblob && !this.utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        return errors;
    }
}