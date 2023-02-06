import I18n from "../../../I18n";
import ModelElement from "../../ModelElement";
import palette from "./palette.hbs";
import './styles.scss';

export default class WidgetElement extends ModelElement {

    paleteHidden = false

    constructor(values) {
        super(values);
    }

    static createPaletteItem() {
        const label = I18n.getInstance().translate(`widgets.${this.widget ?? "GenericWidget" }.label`);
        return palette({category: this.category, type: this.type, widget: this.widget, icon: this.icon, label});
    }

    translate(query) {
        return I18n.getInstance().translate(query);
    }

    validateModel() {}

    validateForm(form) {}

    toJSON(key) {
        const result = super.toJSON(key);
        if (this.params) result["params"] = this.params;
        if (this.data) result["data"] = this.data;
        return result;
    }
}