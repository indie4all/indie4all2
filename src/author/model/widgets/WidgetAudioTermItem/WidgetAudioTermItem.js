/* global $ */
import form from "./form.hbs"
import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";
import './styles.scss';

export default class WidgetAudioTermItem extends WidgetElement {
    config = {
        widget: "AudioTermItem",
        type: "specific-element",
        label: "Audio Term Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACk0lEQVRoge2Zz2vTYBjHv83mxG1sGUxlIK9DEZ0w8CIBsay7+GsHJ0gQdKgIPWyX7aKpJ72Y3tSLh4KI+AMpol566Gmtu1gHIgwq7GLtPzA3p6e1kTcsXUqTNE2yvAnkA4U0ed++n/fJ07dv88SggwjiKQDTYEsFwKdqKfvbzKIhTQTxMYD5QyP7QV+s+PKtjG3xK9VS9rupBhHEB0QQlXzxq8Ka9T+byoWZuwoRxDUiiLyV9NrzdznmwhpU/Mz0HBWfN/LliCAmAPBXpyYYp/IOA/19ODdxmr6/bHSd0w5owyAxaOHDBcrUJpG01+zt2cNLciYhyZmmVSTQ0vxAP/2xWwTwU5Izt7TzYUkPGukXNOoIYU7fRAilR8FKuiZ/RP3NkuP+jKQ/oP42BNJuo6tnV6W3ph6hJr1Wj82i62QynkvrJepLP6CsVNu035mM3Ql0t5xZ/4fas7xlp67Z88Bgr6kEFx8Ddz3ednCnfVuklZVfamcruPgJxM6ONVpo0XEi6gRP0oPeXjerQae0pofJbbdqExsnvgnDSDo2fhg9G686+pCu9A0vndri+epBv0hOI2+3b2t6uKQ7d9+xqN2+nkvr0aeZWRQ7nSR2W7ppIAdyZjDZMLnJe/gZ6aZBXUY9+jfuF5G0X0TSfhFJ+0VopWlRRivQBIb852X09e4zlq6WslS68PDJS2xs/g2E8/tcEeXVCo6QEcPr2t5jobxaWbw4c4+/c+0STh4b9VVSgwYtX1xWpY8fJTgwPGTYTl9HpI9TaS0xoT3oY8HB4SFV2KSWWUinkpONXd52hfS2UUtJziisJmGE3dXDvHLqL6qHXemFAAjTTHgKu9LpVLJAa9Xa8sgAOv5kOpVkNb5LAPwHyz3KdqgqcKEAAAAASUVORK5CYII="
    }

    createElement(widget) {
        return template({
            type: this.config.type,
            widget: this.config.widget,
            icon: this.config.icon,
            id: widget.id
        });
    }

    emptyData() {
        return { data: { term: "", definition: "", audioblob: "", captionsblob: "" } };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            term: model.data.term,
            definition: model.data.definition,
            audioblob: model.data.audioblob,
            captionsblob: model.data.captionsblob
        }
        
        return {
            inputs: form(data),
            title: this.translate("widgets.AudioTermItem.label")
        };
    }

    settingsOpened(model) {
        let $form = $('#f-' + model.id);
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        $iAudio.prop('required', !model.data.audioblob);
        $iCaptions.prop('required', !model.data.captionsblob);

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

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        if (model.data.term && model.data.definition)
            element.innerHTML = model.data.term + " -> " + model.data.definition;
        else
            element.innerHTML = this.translate("widgets.AudioTermItem.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        model.data.term = form.term;
        model.data.definition = form.definition;
        model.data.audioblob = form.audioblob;
        model.data.captionsblob = form.captionsblob;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (widget.data.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.audioblob))
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
