import I18n from "../../../I18n";
import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default class WidgetItemElement extends WidgetElement {
    
    createElement(widget) {
        const label = I18n.getInstance().translate(`widgets.${this.config.widget ?? "GenericWidget" }.label`);
        return template({...this.config, label, id: widget.id});
    }

}