/* global $ */
import "./styles.scss";
import { InputWidgetImageAndSoundItemData } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import ImageSoundItemElement from "./image-sound-item.element";
import { FilePickerType } from "../../services/file-picker/types";

export default class ImageSoundItemRemoteElement extends HasFilePickerElement(ImageSoundItemElement) {

    constructor() { super(); }

    async init(values?: InputWidgetImageAndSoundItemData): Promise<void> {
        if (!values?.data?.captions && values?.data?.captionsblob) {
            const url = await this.utils.base64DataURLToURL(values.data.captionsblob);
            values.data.captions = url;
            delete values.data.captionsblob;
        }

        if (!values?.data?.audio && values?.data?.audioblob) {
            const url = await this.utils.base64DataURLToURL(values.data.audioblob);
            values.data.audio = url;
            delete values.data.audioblob;
        }
        if (!values?.data?.image && values?.data?.blob) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "", alt: "", image: "", audio: "", captions: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                text: this.data.text,
                alt: this.data.alt,
                image: this.data.image,
                audio: this.data.audio,
                captions: this.data.captions
            }));
    }

    settingsOpened() {
        let $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', (e) => {
            $form.find('.preview-error').toggleClass('d-none', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (this.utils.isValidResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
        $preview.on('error', function () {
            const emptySrc = (this as HTMLImageElement).src === window.location.href;
            $form.find('.preview-error').toggleClass('d-none', emptySrc);
            $sectionPreview.toggleClass('d-none', true);
        });
        this.initFilePicker($iImg, FilePickerType.IMAGE);
        this.initFilePicker($form.find('input[name="audio"]'), FilePickerType.AUDIO);
        this.initFilePicker($form.find('input[name="captions"]'), FilePickerType.SUBTITLES);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.audio = form.audio;
        this.data.captions = form.captions;
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isValidResource(this.data.audio))
            errors.push("ImageAndSoundItem.audio.invalid");
        if (!this.utils.isValidResource(this.data.image))
            errors.push("ImageAndSoundItem.image.invalid");
        if (!this.utils.isStringEmptyOrWhitespace(this.data.captions) && !this.utils.isValidResource(this.data.captions))
            errors.push("common.captions.invalid");
        return errors;
    }

    validateForm(form: any) {
        const errors = super.validateForm(form);
        if (!this.utils.isValidResource(form.audio))
            errors.push("ImageAndSoundItem.audio.invalid");
        if (!this.utils.isValidResource(form.image))
            errors.push("ImageAndSoundItem.image.invalid");
        if (!this.utils.isStringEmptyOrWhitespace(form.captions) && !this.utils.isValidResource(form.captions))
            errors.push("common.captions.invalid");
        return errors;
    }
}