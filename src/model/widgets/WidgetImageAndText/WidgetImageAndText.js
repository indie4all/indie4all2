/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetImageAndText extends WidgetItemElement {

    constructor() {
        super();
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
    }

    config = {
        widget: "ImageAndText",
        type: "element",
        label: "Image and Text",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,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",
        cssClass: "widget-imageandtext"
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: ""
            },
            data: { text: "", blob: "", layout: 0, alt: "" }
        }
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            blob: model.data.blob,
            instanceName: model.params.name,
            help: model.params.help,
            alt: model.data.alt
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.ImageAndText.label")
        };
    }

    settingsOpened(model) {
        const $form = $('#f-' + model.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        const editorElement = $form.find('.texteditor');
        this.initTextEditor(model.data.text, editorElement);
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
        element.innerHTML = model.params.name ? model.params.name : this.translate("widgets.ImageAndText.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        model.data.text = this.clearAndSanitizeHtml(form.textblockText);
        model.data.blob = form.blob;
        model.params.name = form.instanceName;
        model.params.help = form.help;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.text.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(widget.data.text)) errors.push("ImageAndText.text.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.blob)) errors.push("common.imageblob.invalid");
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt)) errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.textblockText.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(form.textblockText)) errors.push("TextBlock.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
