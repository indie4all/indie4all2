/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetImageAndSoundItem extends WidgetItemElement {
    
    static widget = "ImageAndSoundItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADlUlEQVRoge2Zb0gTYRjAnztn4TQ3wwohLikkJxWRxCIc6pfKDLKQFZRJfxhkXzaC3IqwPx/cl7AIDAZRfShSgvqQwvrinxloUkjGFvbFjaAPBjr/fSl38bzbXZu7neftdrfCHxzvu+3u3t/ePc9zt3spiIMxW/cCQANoyyQAvAmNdM+ksuClGbO1AwDsW0s2AW5aMfzJDzHxE6GR7rGUGozZeosxW1nvwAdWa8Jz8+yRpmssY7ZOM2arUUx6+vHLHs2FOVD8YMMVFLcL+dKM2VoDAMbG+mqNQ/kvhQX5cKh6P74+LvQ5zXVwx2zCIOJDZ5WpRP5JaV3aZwgvwu/LHtKuFqq+EnJaDqc8av26XKOz3YM5N+Z22fi6nbb0UqcXIm8/yjvYFxCVNhYW4MWuDwBmnO0eh9tlewpqhgfFFENu73XQvRCsYiuB9fpJbNYzI617ZEuQy3GfhdwvHRDxfY2GknyaQZGYFhCmz1gSYzw0Bb92OUiXPlYJdJWJhBU7Hlzt6UtBSWmUpSwmEgYEgx6o3duIGBteBF3vDaAMeoj4AsAOBYANTckfSynpBOEYtKUclsaDJFHZzyE5MyuIYjHN+gJJ71FVpmgnFiq0xUTCI8d1kvQ1l44MJUvHi1F7GPIlSMhgeASzIDz4meYS0KBPiOvIc59SQykoHfpJKgS2CMpGq8iCUkPwKFryOGHSHw/CklOZxFuOpJj+/mMK3g2OkjbpBJZy2YPjryEHSTNdd64VZucWoHBDPrx//TDh3huTC692IKPu8tVllUiSRmGuxdmuKEu8Qcf6PLsxj/TV+DMhKTwunD7KtxVlpUmfz84vwKmWO2TDfqaRJN1mb4bgcBdpUwn7JybJpoZ4WheXeGEONcQlSV+920m2eISEOTItvmIiouyrngH+9b2bLaLCHNFwCcKBfRWKCsNK0suFub7/W1BUONOISscLi72nNmvPPdTi/5NO9zl1pp5ziyZiV2eb7MTDUqeJNA5qv9SYkYHTYS0R1YKOLcpwCzRZg3dwFPL1ecIzHRrpRun+2/efqXIvLAVMfrxN2M6UCO7NJaLDPzHZV9fUaryY4kZfDXDSvAOjRHrnDgY2FxcJjhq/joiPU3EtsYZ70KcFW4qLiHCKctnvdtlq+ZIXWyE9L7Sns93DavUlhJBaPVKvnKoL8ZAq7cgCYYyEByBV2u2y9eNaNVceNQDHr3W7bNr980gLAPgDFU9nVf9zP90AAAAASUVORK5CYII=";
    static cssClass = "widget-image-and-sound-item";
    static paletteHidden = true;
    
    constructor(values) {
        super(values);
        this.data = values?.data ?? { text: "", alt: "", blob: "", audioblob: "", captionsblob: "" };
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