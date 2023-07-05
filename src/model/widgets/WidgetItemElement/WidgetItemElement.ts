import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";
import Utils from "../../../Utils";

export default abstract class WidgetItemElement extends WidgetElement {

    constructor(values?: any) { super(values); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            canCopy: constructor.copyable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            cssClass: Utils.toKebabCase(constructor.name),
            label: this.preview()
        });
    }
}