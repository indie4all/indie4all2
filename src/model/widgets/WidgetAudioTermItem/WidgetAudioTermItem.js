/* global $ */
import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetAudioTermItem extends WidgetItemElement {

    static widget = "AudioTermItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACk0lEQVRoge2Zz2vTYBjHv83mxG1sGUxlIK9DEZ0w8CIBsay7+GsHJ0gQdKgIPWyX7aKpJ72Y3tSLh4KI+AMpol566Gmtu1gHIgwq7GLtPzA3p6e1kTcsXUqTNE2yvAnkA4U0ed++n/fJ07dv88SggwjiKQDTYEsFwKdqKfvbzKIhTQTxMYD5QyP7QV+s+PKtjG3xK9VS9rupBhHEB0QQlXzxq8Ka9T+byoWZuwoRxDUiiLyV9NrzdznmwhpU/Mz0HBWfN/LliCAmAPBXpyYYp/IOA/19ODdxmr6/bHSd0w5owyAxaOHDBcrUJpG01+zt2cNLciYhyZmmVSTQ0vxAP/2xWwTwU5Izt7TzYUkPGukXNOoIYU7fRAilR8FKuiZ/RP3NkuP+jKQ/oP42BNJuo6tnV6W3ph6hJr1Wj82i62QynkvrJepLP6CsVNu035mM3Ql0t5xZ/4fas7xlp67Z88Bgr6kEFx8Ddz3ednCnfVuklZVfamcruPgJxM6ONVpo0XEi6gRP0oPeXjerQae0pofJbbdqExsnvgnDSDo2fhg9G686+pCu9A0vndri+epBv0hOI2+3b2t6uKQ7d9+xqN2+nkvr0aeZWRQ7nSR2W7ppIAdyZjDZMLnJe/gZ6aZBXUY9+jfuF5G0X0TSfhFJ+0VopWlRRivQBIb852X09e4zlq6WslS68PDJS2xs/g2E8/tcEeXVCo6QEcPr2t5jobxaWbw4c4+/c+0STh4b9VVSgwYtX1xWpY8fJTgwPGTYTl9HpI9TaS0xoT3oY8HB4SFV2KSWWUinkpONXd52hfS2UUtJziisJmGE3dXDvHLqL6qHXemFAAjTTHgKu9LpVLJAa9Xa8sgAOv5kOpVkNb5LAPwHyz3KdqgqcKEAAAAASUVORK5CYII=";
    static cssClass = "widget-audio-term-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.data = values?.data ?? { term: "", definition: "", audioblob: "", captionsblob: "" };
    }

    clone() {
        return new WidgetAudioTermItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                term: this.data.term,
                definition: this.data.definition,
                audioblob: this.data.audioblob,
                captionsblob: this.data.captionsblob
            }
            
            return {
                inputs: form(data),
                title: this.translate("widgets.AudioTermItem.label")
            };
        });
    }

    settingsOpened() {
        let $form = $('#f-' + this.id);
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        $iAudio.prop('required', !this.data.audioblob);
        $iCaptions.prop('required', !this.data.captionsblob);

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

    preview() {
        return this.data?.term && this.data?.definition ?
            this.data.term + " -> " + this.data.definition :
            this.translate("widgets.AudioTermItem.prev");
    }

    updateModelFromForm(form) {
        this.data.term = form.term;
        this.data.definition = form.definition;
        this.data.audioblob = form.audioblob;
        this.data.captionsblob = form.captionsblob;
    }

    validateModel() {
        var errors = [];
        if (this.data.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (this.data.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (form.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        if (!Utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }
}
