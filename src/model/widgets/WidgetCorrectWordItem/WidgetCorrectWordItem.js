/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetCorrectWordItem extends WidgetItemElement {
    
    config = {
        widget: "CorrectWordItem",
        type: "specific-element",
        label: "Correct Word Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAh1BMVEUAAAAeN1Z4h5oeN1Y4T2owR2MjPFp4h5oeN1YeN1Z4h5pOYXkpQV8oQF14h5ozSmZ4h5orQ2AmPlx4h5opQF54h5orQ2AeN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1aOm6rHzdVWaIA9Um35DVxHXHXx8vS4wMqcp7VecIeqtL+AjqBygpVTHpl4AAAAHXRSTlMAQMCA/tD3QDAQ8CDs6uDc0MymoJeQiHBgYFAwEEG2VFcAAACmSURBVEjH7c7LDoIwEIXhqhUKeL/f2hG1BdT3fz4VSkhM7LQxISz6b2bzZXLIOzZA2kekbgX0Yg7GTNsNZBxJyUD/DnKOpui2tD1QHO8x1JhbdO4InoYne3wV8c4BCxG64KUL7nvcKr59+nU7utljj//ECaQWWMoSk7lUqL1DUWEW0Dw1lj1BigqTaDECc7QQGtcJU994huJ1g0PMxglpOkzMI47kBYF000tT6KuDAAAAAElFTkSuQmCC",
        cssClass: "widget-correct-word-item"
    }

    emptyData() {
        return { data: { question: "", word: "", blob: "", alt: "" }};
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            question: model.data.question,
            word: model.data.word,
            blob: model.data.blob,
            alt: model.data.alt
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.CorrectWordItem.label")
        };
    }

    settingsOpened(model) {
        const $form = $('#f-' + model.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !model.data.blob);
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
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.innerHTML = (model.data.question && model.data.word) ? (model.data.question + " -> " + model.data.word) : this.translate("widgets.CorrectWordItem.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        model.data.question = form.question;
        model.data.blob = form.blob;
        model.data.word = form.word;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var errors = [];
        if (!Utils.isValidBase64DataUrl(widget.data.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.question)) 
            errors.push("CorrectWordItem.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.word))
            errors.push("CorrectWordItem.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.question)) errors.push("formData.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.word)) errors.push("formData.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid");
        return errors;
    }
}
