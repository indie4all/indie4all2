import form from "./form.hbs";
import prev from "./prev.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetAnimationItem extends WidgetItemElement {
    config = {
        widget: "AnimationItem",
        type: "specific-element",
        label: "Animation Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACeElEQVRogWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYNTR1AbsbKwCFe2zHCraZ6GUIoPa0QJ8PKDKbj8DA8P9ivZZCTDxoZI8QCE9HxTqDEMwTcczDEFHKzCMlh50BEPS0SzYBP9ffsjA8PEbqiA/FwOjrjydnIUfYHX034qlDP8OX0cRY7LVZGDZWgXnh2c1wtq+OMHKafUMFkZacGl5i3CS1OMCWB1NDNBSU0BRBfIAHy83g5YqIjb4eLlQ1KA7CF0PunqqO7q+IB6FDwpFkOWg0MIF0OWI0YMNDJ+MyJTpzsBoo4kixqgrRy83EQTYHe1jzMAAwiSCT1++EcycNHM0ueDarQfgUmXIOJrUzAQDxJYYyIBqjiamfKUWGG170AuMOppeYNTR9AKjjqYXGHU0vcCoo+kFmKCTMnRpB5MCdh46zcDNxYlVB9Ojk6tAjj7QOGEhw6cvXweFg9dsPQhumyvJSWKVhzVNC6/derDfM7ZcIDnCi0FLVQGrYloDUKDtPHga7Gh1ZTkGMRFBrDYizyOChlNBc4kOsIG+gQDiIoJgB+OYyzzQUZnmCO8EQGdIE7GprGif9X+gPIENEFt64J45pS8Au4NYRxcOAgeDUsJEBmId3VGZdgA0Vw0rHgcAgOx37KhMGyj7KQQMDAwAoOKne2Zj77sAAAAASUVORK5CYII=",
        cssClass: "widget-animation-item"
    }

    emptyData(id) {
        return { 
            id: id ?? Utils.generate_uuid(),
            type: this.config.type,
            widget: this.config.widget,
            data: { image: "" } };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            image: model.data ? model.data.image : ''
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.AnimationItem.label")
        };
    }

    preview(model) {
        return model.data?.image ? prev(model.data) : this.translate("widgets.AnimationItem.prev");
    }

    updateModelFromForm(model, form) {
        model.data.image = form.image;
    }

    validateModel(widget) {
        var errors = [];
        if (!Utils.isIndieResource(widget.data.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

}
