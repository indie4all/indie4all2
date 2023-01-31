/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetCorrectWordItem extends WidgetItemElement {

    static widget = "CorrectWordItem";
    static type = "specific-element";
    static label = "Correct Word Item";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAh1BMVEUAAAAeN1Z4h5oeN1Y4T2owR2MjPFp4h5oeN1YeN1Z4h5pOYXkpQV8oQF14h5ozSmZ4h5orQ2AmPlx4h5opQF54h5orQ2AeN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1aOm6rHzdVWaIA9Um35DVxHXHXx8vS4wMqcp7VecIeqtL+AjqBygpVTHpl4AAAAHXRSTlMAQMCA/tD3QDAQ8CDs6uDc0MymoJeQiHBgYFAwEEG2VFcAAACmSURBVEjH7c7LDoIwEIXhqhUKeL/f2hG1BdT3fz4VSkhM7LQxISz6b2bzZXLIOzZA2kekbgX0Yg7GTNsNZBxJyUD/DnKOpui2tD1QHO8x1JhbdO4InoYne3wV8c4BCxG64KUL7nvcKr59+nU7utljj//ECaQWWMoSk7lUqL1DUWEW0Dw1lj1BigqTaDECc7QQGtcJU994huJ1g0PMxglpOkzMI47kBYF000tT6KuDAAAAAElFTkSuQmCC";
    static cssClass = "widget-correct-word-item";

    constructor(values) {
        super(values);
        this.data = values?.data ?? { question: "", word: "", blob: "", alt: "" };
    }

    clone() {
        return new WidgetCorrectWordItem(this);
    }

    getInputs() {
        var data = {
            instanceId: this.id,
            question: this.data.question,
            word: this.data.word,
            blob: this.data.blob,
            alt: this.data.alt
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.CorrectWordItem.label")
        };
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !this.data.blob);
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
    }

    preview() {
        return (this.data?.question && this.data?.word) ? 
            (this.data.question + " -> " + this.data.word) : this.translate("widgets.CorrectWordItem.prev");
    }

    updateModelFromForm(form) {
        this.data.question = form.question;
        this.data.blob = form.blob;
        this.data.word = form.word;
        this.data.alt = form.alt;
    }

    validateModel() {
        var errors = [];
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.question)) 
            errors.push("CorrectWordItem.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.word))
            errors.push("CorrectWordItem.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
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
