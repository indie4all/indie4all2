/* global $ */
import form from "./form.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";
import "./styles.scss";

export default class WidgetSchemaItem extends WidgetElement {
    config = {
        widget: "SchemaItem",
        type: "specific-element",
        label: "Schema Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACZ0lEQVRoBWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYNTR1AbsbKwCFe2zHCraZ6GUIoPa0QJ8PKDKbj8DA8P9ivZZCTDxoZI8QCE9HxTqDEMwTcczUNvRoCo4PKuRmkaiAwWG0dKDjmDU0fQCQ9LRLKQo/rf0MMO/ZYdxyqt+/spQ9fw1wx/vNtyG8HMxsExPA9PkApIc/SdzFl55XgYGBk2Q515ex6vur+5OBubKQLIdPZqm6QWGv6MZdeWpYimjrhxF+knKiKxHWxj+H8Gdya7eesiwZusBhvrCeNyGyIkyMMqJkORIdECSo0GA0UYTp9wXrv8M189w4lVDDTCaEekFRh1NL0BVR4MGLkO9HWjudKo7mh7Da6PJg15g1NH0AqOOphdggk7KwCZoBg3Yeeg0AzcXJ/aQfnRyFcjRBxonLGT49OXroHDzmq0HGa7desCgJCeJVR7WNC28duvBfs/YcoHkCC8GLVUFujoSBkCBtvPgabCj1ZXlGMREBLGqQ55HBA2nguYSHWADfQMBxEUEwQ7GMZd5oKMyzRHeCYDOkCZiU1nRPuv/QHkCGyC29MA9c0pfAHYHsY4uHAQOBqWEiQzEOrqjMu0AaK4aVjwOAADZ79hRmTZQ9lMIGBgYAGcFnkaUo+5mAAAAAElFTkSuQmCC"        
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
        return { data: { blob: "", alt: "" } };
    }

    getInputs(model) {
        const data = {
            instanceId: model.id,
            alt: model.data.alt,
            blob: model.data.blob
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.SchemaItem.label")
        };
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.innerHTML = model.data.alt ? model.data.alt : this.translate("widgets.SchemaItem.prev");
        return element;
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

    updateModelFromForm(model, form) {
        model.data.blob = form.blob;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var errors = [];
        if (!Utils.isValidBase64DataUrl(widget.data.blob))
            errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt))
            errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (!Utils.isValidBase64DataUrl(form.blob)) 
            errors.push("common.imageblob.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            errors.push("common.alt.invalid")
        return errors;
    }
}