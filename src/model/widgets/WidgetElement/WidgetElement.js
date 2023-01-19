import I18n from "../../../I18n";
import ModelElement from "../../ModelElement";
import palette from "./palette.hbs";
import './styles.scss';

export default class WidgetElement extends ModelElement {

    paleteHidden = false

    createPaletteItem() {
        const label = I18n.getInstance().translate(`widgets.${this.config.widget ?? "GenericWidget" }.label`);
        return palette({...this.config, label});
    }

    translate(query) {
        return I18n.getInstance().translate(query);
    }

    validateModel(model) {}

    validateForm(form) {}
}