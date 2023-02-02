/* global $ */
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetImage extends WidgetItemElement {

    static widget = "Image";
    static type = "element";
    static label = "Image";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADXUlEQVRoge2ZXUgUURSAz467mau4K5oh1NgPJT1EQsRAZBpERQUZxEBWVC/Sz4u+xNpTELS+WQ8ZDERP/ehLQRYJgoYiWRiSUBCEOj6Jbbqpa+vO7sSZnG22vXd3dnZnRsMPFnZ+7pzv3jlz5u5eB2hgOb4aAOrBXsYB4IU41DlLs4hLsxzfBgBNmyo2AH7s4t3Hz7Asfloc6hyharAcf4vleLn77XvZboJz8/KxCzdkluNnWI73ppKeefjsle3CKii+v/46ijeRfBmW4+sAwHvmRK3NqfyX4qJCOFK7D7dPkY4z6hc8cSXhSeHDrChTnaxJ55r8dS6vzy/U+fxCQhVJKS2L3yHqfx7/4LaVeIuL8GXXCwBjPr9wSQ3tpAqPTkDk+B2AYCi+L9r+BlxPm8BxYJfVg44j/cjnF8ZbWxr7qCMtnb2bIKwQDIF0RbDAkcpFoKUHjjItFXC/PPDFBl+FLfBfVQ/H7koAj5vcwuPOOqezvVPUkXY+aCTvbz2fVUDpqqA84LHH/YavQa0ezMm94Hp9E6Lt3X8eSI8b8q4dzWqUUViVxe8YnDlXkztpBAWdOSpvWmHtPiPiljyIJGE9x2iYLq1HKlNxU6UzkcnkXNOkjdx2vW1ST5hGJ0BqILzOcxTcaFuqNL6ulXraNZw0cco2qK5rdA1Tj5OlcWKkmTCRZnxmCatgTBrxOt0zsNyzXxGIPekHGSeDNZUJzRzN94FpqAFY70q6HI6MLIpJbYwytvgDr0psnTTSsZ5PIE8Fyb2fCiodwo4lCY+KOZHVQ4K0nuD/ilstDNr0kD980x08Ll7usVwYtNKYFpmgpBAljcxmVf4ISDnLQwKxCASikmkCO10FGbdJKz0YnoOXoYBRp7QIpTsybpNWuspZAOAuNcPXMGml8fYZuYVmsvZfnlWsWmlclIGvkUX7bTSMLM1DoZv8LDHiUCdK93WEpiEkk2dVVjMY/gmTUhi2sRXEyGr1aJ6Uwr23Z0Xv4QIvbM7Lt0U2JEdhZGlBka7azkJ5WQnxPEUa1+tYjt8aiEXaOham69Q/+uxgY1kJHKzek3ItM16nl1dIL5NO8vkF2a5OkNBbPegrp9aieOiVbl4BwpgJ90CvNC4Z4Fq1Wh5tAOMfam1ptCt+lgDAb7cafqL8lCv0AAAAAElFTkSuQmCC";
    static cssClass = "widget-image";

    constructor(values) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.params = values?.params ?? {
            name: WidgetImage.label + "-" + Utils.generate_uuid(),
            help: "",
        };
        this.data = values?.data ?? { text: "", blob: "", alt: "" };
    }

    clone() {
        return new WidgetImage(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt,
                text: this.data.text,
                blob: this.data.blob
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.Image.label")
            };
        });
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetImage.label + "-" + Utils.generate_uuid();
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !this.data.blob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);

        var editorElement = $form.find('.texteditor');
        this.initTextEditor(this.data.text, editorElement);

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
        return this.params?.name ?? this.translate("widgets.Image.prev")
    }

    updateModelFromForm(form) {
        // TODO:
        this.data.text = this.clearAndSanitizeHtml(form.text);
        this.data.blob = form.blob;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel() {
        var keys = [];
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            keys.push("common.imageblob.invalid");
        if (!this.data.text || (this.data.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(this.data.text))
            keys.push("TextBlock.text.invalid");
        if (!Utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            keys.push("common.alt.invalid")
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (!Utils.isValidBase64DataUrl(form.blob))
            keys.push("common.imageblob.invalid");
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        if (!form.text || (form.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(form.text))
            keys.push("TextBlock.text.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            keys.push("common.alt.invalid")
        return keys;
    }
}