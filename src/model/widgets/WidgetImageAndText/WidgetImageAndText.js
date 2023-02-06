/* global $ */
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetImageAndText extends WidgetItemElement {

    static widget = "ImageAndText";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,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";
    static cssClass = "widget-imageandtext";

    constructor(values) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.params = values?.params ?? {
            name: "Image and Text-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ?? { text: "", blob: "", layout: 0, alt: "" };
    }

    clone() {
        return new WidgetImageAndText(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                blob: this.data.blob,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.ImageAndText.label")
            };
        });
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Image and Text-" + Utils.generate_uuid();
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        const editorElement = $form.find('.texteditor');
        this.initTextEditor(this.data.text, editorElement);
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
        return this.params?.name ?? this.translate("widgets.ImageAndText.prev");
    }

    updateModelFromForm(form) {
        this.data.text = this.clearAndSanitizeHtml(form.textblockText);
        this.data.blob = form.blob;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel() {
        var errors = [];
        if (this.data.text.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(this.data.text)) errors.push("ImageAndText.text.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid")
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
