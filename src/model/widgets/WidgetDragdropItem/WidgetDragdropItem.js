import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetDragdropItem extends WidgetItemElement {

    static widget = "DragdropItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-dragdrop-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { term: "", definition: "" };
    }

    clone() {
        return new WidgetDragdropItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                term: this.data ? this.data.term : '',
                definition: this.data ? this.data.definition : ''
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.DragdropItem.label")
            };
        });
    }

    preview() {
        return this.data?.term && this.data?.definition ?
            `<p><b>${this.data.term}</b><span> -> ${this.data.definition}</span></p>` :
            this.translate("widgets.DragdropItem.prev");
    }

    updateModelFromForm(form) {
        this.data.term = form.term;
        this.data.definition = form.definition;
    }

    validateModel() {
        var errors = [];
        if (this.data.term.length == 0) errors.push("DragpdropItem.term.invalid");
        if (this.data.term.definition == 0) errors.push("DragpdropItem.definition.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.term.length == 0) errors.push("DragpdropItem.term.invalid");
        if (form.term.definition == 0) errors.push("DragpdropItem.definition.invalid");
        return errors;
    }
}
