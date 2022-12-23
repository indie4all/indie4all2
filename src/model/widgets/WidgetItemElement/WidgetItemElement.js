import I18n from "../../../I18n";
import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default class WidgetItemElement extends WidgetElement {
    
    createElement(widget) {
        const i18n = I18n.getInstance();
        const path = i18n.hasKey(`widgets.${this.config.widget}.prev`) ? 
            `widgets.${this.config.widget}.prev` :
            `widgets.${this.config.widget ?? "GenericWidget" }.label`;
        const label = i18n.translate(path);
        return template({...this.config, label, id: widget.id});
    }

}