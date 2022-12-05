/* global $ */
import form from "./form.hbs";
import palette from "./palette.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";

export default class WidgetImage extends WidgetElement {

    constructor() {
        super();
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
    }

    config = {
        widget: "Image",
        type: "element",
        label: "Image",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADXUlEQVRoge2ZXUgUURSAz467mau4K5oh1NgPJT1EQsRAZBpERQUZxEBWVC/Sz4u+xNpTELS+WQ8ZDERP/ehLQRYJgoYiWRiSUBCEOj6Jbbqpa+vO7sSZnG22vXd3dnZnRsMPFnZ+7pzv3jlz5u5eB2hgOb4aAOrBXsYB4IU41DlLs4hLsxzfBgBNmyo2AH7s4t3Hz7Asfloc6hyharAcf4vleLn77XvZboJz8/KxCzdkluNnWI73ppKeefjsle3CKii+v/46ijeRfBmW4+sAwHvmRK3NqfyX4qJCOFK7D7dPkY4z6hc8cSXhSeHDrChTnaxJ55r8dS6vzy/U+fxCQhVJKS2L3yHqfx7/4LaVeIuL8GXXCwBjPr9wSQ3tpAqPTkDk+B2AYCi+L9r+BlxPm8BxYJfVg44j/cjnF8ZbWxr7qCMtnb2bIKwQDIF0RbDAkcpFoKUHjjItFXC/PPDFBl+FLfBfVQ/H7koAj5vcwuPOOqezvVPUkXY+aCTvbz2fVUDpqqA84LHH/YavQa0ezMm94Hp9E6Lt3X8eSI8b8q4dzWqUUViVxe8YnDlXkztpBAWdOSpvWmHtPiPiljyIJGE9x2iYLq1HKlNxU6UzkcnkXNOkjdx2vW1ST5hGJ0BqILzOcxTcaFuqNL6ulXraNZw0cco2qK5rdA1Tj5OlcWKkmTCRZnxmCatgTBrxOt0zsNyzXxGIPekHGSeDNZUJzRzN94FpqAFY70q6HI6MLIpJbYwytvgDr0psnTTSsZ5PIE8Fyb2fCiodwo4lCY+KOZHVQ4K0nuD/ilstDNr0kD980x08Ll7usVwYtNKYFpmgpBAljcxmVf4ISDnLQwKxCASikmkCO10FGbdJKz0YnoOXoYBRp7QIpTsybpNWuspZAOAuNcPXMGml8fYZuYVmsvZfnlWsWmlclIGvkUX7bTSMLM1DoZv8LDHiUCdK93WEpiEkk2dVVjMY/gmTUhi2sRXEyGr1aJ6Uwr23Z0Xv4QIvbM7Lt0U2JEdhZGlBka7azkJ5WQnxPEUa1+tYjt8aiEXaOham69Q/+uxgY1kJHKzek3ItM16nl1dIL5NO8vkF2a5OkNBbPegrp9aieOiVbl4BwpgJ90CvNC4Z4Fq1Wh5tAOMfam1ptCt+lgDAb7cafqL8lCv0AAAAAElFTkSuQmCC"
    }

    createElement(widget) {
        return template({
            type: this.config.type,
            widget: this.config.widget,
            icon: this.config.icon,
            id: widget.id
        });
    }

    createPaletteItem() {
        return { 
            content: palette(this.config),
            numItems: 1
        }
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: "",
            },
            data: { text: "", blob: "", alt: "" }
        };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help,
            alt: model.data.alt,
            text: model.data.text,
            blob: model.data.blob
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.Image.label")
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

        var editorElement = $form.find('.texteditor');
        this.initTextEditor(model.data.text, editorElement);

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
        element.innerHTML = (model.data.text && model.data.image && model.params.name) ? model.params.name : this.translate("widgets.Image.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        // TODO:
        model.data.text = this.clearAndSanitizeHtml(form.text);
        model.data.blob = form.blob;
        model.params.name = form.instanceName;
        model.params.help = form.help;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var keys = [];
        if (!Utils.isValidBase64DataUrl(widget.data.blob))
            keys.push("common.imageblob.invalid");
        if (!widget.data.text || (widget.data.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(widget.data.text))
            keys.push("TextBlock.text.invalid");
        if (!Utils.hasNameInParams(widget))
            keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt))
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