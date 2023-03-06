import WidgetElement from "../WidgetElement/WidgetElement";
import ModelElement from "../../ModelElement";
import template from "./template.hbs";

export default abstract class WidgetItemElement extends WidgetElement {

    constructor(values?: any) { super(values); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        return template({
            id: this.id,
            cssClass: constructor.cssClass,
            widget: constructor.widget,
            icon: constructor.icon,
            canCopy: constructor.copyable,
            canEdit: constructor.editable,
            label: this.preview()
        });
    }
}