import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default abstract class WidgetItemElement extends WidgetElement {

    constructor(values?: any) { super(values); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        const canCopy = WidgetItemElement.type !== 'specific-element';
        return template({
            id: this.id,
            type: constructor.type,
            cssClass: constructor.cssClass,
            widget: constructor.widget,
            icon: constructor.icon,
            canEdit: constructor.editable,
            label: this.preview(),
            canCopy
        });
    }
}