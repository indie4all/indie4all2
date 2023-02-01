import form from "./form.hbs";
import prev from "./prev.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetAnimationItem extends WidgetItemElement {

    static widget = "AnimationItem";
    static type = "specific-element";
    static label = "Animation Item";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACeElEQVRogWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYNTR1AbsbKwCFe2zHCraZ6GUIoPa0QJ8PKDKbj8DA8P9ivZZCTDxoZI8QCE9HxTqDEMwTcczDEFHKzCMlh50BEPS0SzYBP9ffsjA8PEbqiA/FwOjrjydnIUfYHX034qlDP8OX0cRY7LVZGDZWgXnh2c1wtq+OMHKafUMFkZacGl5i3CS1OMCWB1NDNBSU0BRBfIAHy83g5YqIjb4eLlQ1KA7CF0PunqqO7q+IB6FDwpFkOWg0MIF0OWI0YMNDJ+MyJTpzsBoo4kixqgrRy83EQTYHe1jzMAAwiSCT1++EcycNHM0ueDarQfgUmXIOJrUzAQDxJYYyIBqjiamfKUWGG170AuMOppeYNTR9AKjjqYXGHU0vcCoo+kFmKCTMnRpB5MCdh46zcDNxYlVB9Ojk6tAjj7QOGEhw6cvXweFg9dsPQhumyvJSWKVhzVNC6/derDfM7ZcIDnCi0FLVQGrYloDUKDtPHga7Gh1ZTkGMRFBrDYizyOChlNBc4kOsIG+gQDiIoJgB+OYyzzQUZnmCO8EQGdIE7GprGif9X+gPIENEFt64J45pS8Au4NYRxcOAgeDUsJEBmId3VGZdgA0Vw0rHgcAgOx37KhMGyj7KQQMDAwAoOKne2Zj77sAAAAASUVORK5CYII=";
    static cssClass = "widget-animation-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.data = values?.data ?? { image: ""};
    }

    clone() {
        return new WidgetAnimationItem(this);
    }

    getInputs() {
        var data = {
            instanceId: this.id,
            image: this.data?.image ?? ''
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.AnimationItem.label")
        };
    }

    preview() {
        return this.data?.image ? prev(this.data) : this.translate("widgets.AnimationItem.prev");
    }

    updateModelFromForm(form) {
        this.data.image = form.image;
    }

    validateModel() {
        var errors = [];
        if (!Utils.isIndieResource(this.data.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

}
