/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";


export default class WidgetButtonTextItem extends WidgetItemElement {

    constructor() {
        super();
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
    }

    config = {
        widget: "ButtonTextItem",
        type: "specific-element",
        label: "Buttons with text Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1YeN1Z4h5owR2MjPFp4h5oeN1YeN1Z4h5ooQF5OYXl4h5ozSmZ4h5orQ2AmPlx4h5p4h5oqQV8eN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1b5DVz8hq2Om6pWaIDHzdU9Um39wtbcZo3rOXTx8vQ4Tmq4wMpygpVHXHWqtL/+4evj5urV2d/9pMKcp7X7Z5lecIf6SYT5G2aAjqBGWnQqQl/wyqdVAAAAGnRSTlMAQIDA0PdAMBDw6yDg3NDMpqCQkHBgYFAwEMgBv1gAAAD/SURBVEjH1c9pU4MwEIDhWAV6eN8mG6CiCUfvVv3//8y4TQeHkqx+6Ax9P2XIQ2aXmaIe0WOf7boDnfqDYWRtD3JOpMrAvh0sOJnS92hPQHG6jzOLuW2WVM7/kgYuAOBryk1xjB8Aa8UzvCrMabLZTAic4JU2p6WUyz18Eb78whVepZxn0pQ18asYPNRYaTDlnK9/8HofCxEixqZFmho7l9i8Bd8gpkN8etRYOuryzIdbMHPU5QXfHbXi2FGXF/zXzG+Ourzgn/AIxpyu/ETMrkpF2gpWWxwFejH2lhdQii1m/esh+NMrYfEu4auJL0l8W+OQsoMRq3s69w/xzL4BGGHGT7oqAiYAAAAASUVORK5CYII=",
        cssClass: "widget-button-text-item"
    }

    emptyData(id) {
        return { 
            id: id ?? Utils.generate_uuid(),
            type: this.config.type,
            widget: this.config.widget,
            data: { text: "", blob: "", alt: "" } };
    }

    getInputs(model) {
        const data = {
            instanceId: model.id,
            blob: model.data.blob,
            alt: model.data.alt,
        }

        return {
            inputs: form(data),
            title: this.translate("strings.widgets.ButtonTextItem.label")
        };
    }

    preview(model) {
        return model.data?.alt ? model.data.alt : this.translate("widgets.ButtonTextItem.prev");
    }

    settingsOpened(model) {
        let $editor = $('#f-' + model.id + ' .texteditor');
        this.initTextEditor(model.data.text, $editor);
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

    updateModelFromForm(model, form) {
        model.data.text = this.clearAndSanitizeHtml(form.text);
        model.data.blob = form.blob;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(widget.data.text)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(form.text)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }

}