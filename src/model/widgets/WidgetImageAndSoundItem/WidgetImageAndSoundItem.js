/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetImageAndSoundItem extends WidgetItemElement {
    
    static widget = "ImageAndSoundItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-image-and-sound-item";
    static paletteHidden = true;
    
    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "", alt: "", blob: "", audioblob: "", captionsblob: "" };
    }

    clone() {
        return new WidgetImageAndSoundItem(this);
    }


    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                text: this.data.text,
                alt: this.data.alt,
                blob: this.data.blob,
                audioblob: this.data.audioblob,
                captionsblob: this.data.captionsblob
            }
            return {
                inputs: form(data),
                title: this.translate("widgets.ImageAndSoundItem.label")
            };
        });
    }

    preview() {
        return this.data?.text ? this.data.text : this.translate("widgets.ImageAndSoundItem.prev");
    }

    settingsOpened() {
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
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                    $preview.attr('src', value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });

        $iAudio.on('change', function() {
            $iAudioBlob.val('');
            $iAudio.prop('required', true);
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iAudio.prop('required', false);
                    $iAudioBlob.val(value);
                });
            }
        });

        $iCaptions.on('change', function() {
            $iCaptionsBlob.val('');
            $iCaptions.prop('required', true);
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iCaptions.prop('required', false);
                    $iCaptionsBlob.val(value);
                });
            }
        });
    }

    updateModelFromForm(form) {
        this.data.audioblob = form.audioblob;
        this.data.captionsblob = form.captionsblob;
        this.data.blob = form.blob;
        this.data.text = form.text;
        this.data.alt = form.alt;
    }

    validateModel() {
        var errors = [];
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

    validateForm(form) {
        var errors = [];
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