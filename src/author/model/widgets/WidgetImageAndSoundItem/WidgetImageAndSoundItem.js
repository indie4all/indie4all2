/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetImageAndSoundItem extends WidgetItemElement {
    
    config = {
        widget: "ImageAndSoundItem",
        type: "specific-element",
        label: "Image and Sound Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADlUlEQVRoge2Zb0gTYRjAnztn4TQ3wwohLikkJxWRxCIc6pfKDLKQFZRJfxhkXzaC3IqwPx/cl7AIDAZRfShSgvqQwvrinxloUkjGFvbFjaAPBjr/fSl38bzbXZu7neftdrfCHxzvu+3u3t/ePc9zt3spiIMxW/cCQANoyyQAvAmNdM+ksuClGbO1AwDsW0s2AW5aMfzJDzHxE6GR7rGUGozZeosxW1nvwAdWa8Jz8+yRpmssY7ZOM2arUUx6+vHLHs2FOVD8YMMVFLcL+dKM2VoDAMbG+mqNQ/kvhQX5cKh6P74+LvQ5zXVwx2zCIOJDZ5WpRP5JaV3aZwgvwu/LHtKuFqq+EnJaDqc8av26XKOz3YM5N+Z22fi6nbb0UqcXIm8/yjvYFxCVNhYW4MWuDwBmnO0eh9tlewpqhgfFFENu73XQvRCsYiuB9fpJbNYzI617ZEuQy3GfhdwvHRDxfY2GknyaQZGYFhCmz1gSYzw0Bb92OUiXPlYJdJWJhBU7Hlzt6UtBSWmUpSwmEgYEgx6o3duIGBteBF3vDaAMeoj4AsAOBYANTckfSynpBOEYtKUclsaDJFHZzyE5MyuIYjHN+gJJ71FVpmgnFiq0xUTCI8d1kvQ1l44MJUvHi1F7GPIlSMhgeASzIDz4meYS0KBPiOvIc59SQykoHfpJKgS2CMpGq8iCUkPwKFryOGHSHw/CklOZxFuOpJj+/mMK3g2OkjbpBJZy2YPjryEHSTNdd64VZucWoHBDPrx//TDh3huTC692IKPu8tVllUiSRmGuxdmuKEu8Qcf6PLsxj/TV+DMhKTwunD7KtxVlpUmfz84vwKmWO2TDfqaRJN1mb4bgcBdpUwn7JybJpoZ4WheXeGEONcQlSV+920m2eISEOTItvmIiouyrngH+9b2bLaLCHNFwCcKBfRWKCsNK0suFub7/W1BUONOISscLi72nNmvPPdTi/5NO9zl1pp5ziyZiV2eb7MTDUqeJNA5qv9SYkYHTYS0R1YKOLcpwCzRZg3dwFPL1ecIzHRrpRun+2/efqXIvLAVMfrxN2M6UCO7NJaLDPzHZV9fUaryY4kZfDXDSvAOjRHrnDgY2FxcJjhq/joiPU3EtsYZ70KcFW4qLiHCKctnvdtlq+ZIXWyE9L7Sns93DavUlhJBaPVKvnKoL8ZAq7cgCYYyEByBV2u2y9eNaNVceNQDHr3W7bNr980gLAPgDFU9nVf9zP90AAAAASUVORK5CYII=",
        cssClass: "widget-image-and-sound-item"
    }

    emptyData() {
        return {
            data: { text: "", alt: "", blob: "", audioblob: "", captionsblob: "" }
        };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            text: model.data.text,
            alt: model.data.alt,
            blob: model.data.blob,
            audioblob: model.data.audioblob,
            captionsblob: model.data.captionsblob
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.ImageAndSoundItem.label")
        };
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.innerHTML = model.data.text ? model.data.text : this.translate("widgets.ImageAndSoundItem.prev");
        return element;
    }

    settingsOpened(model) {
        let $form = $('#f-' + model.id);
        const $iImg = $form.find('input[name=image]');
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iBlob = $form.find('input[name=blob]');
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !model.data.blob);
        $iAudio.prop('required', !model.data.audioblob);
        $iCaptions.prop('required', !model.data.captionsblob);
        $sectionPreview.toggleClass('d-none', !model.data.blob);
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

    updateModelFromForm(model, form) {
        model.data.audioblob = form.audioblob;
        model.data.captionsblob = form.captionsblob;
        model.data.blob = form.blob;
        model.data.text = form.text;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var errors = [];
        if (!Utils.isValidBase64DataUrl(widget.data.audioblob)) 
            errors.push("common.audioblob.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.blob)) 
            errors.push("common.imageblob.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt))
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