import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";
import Utils from "../../../Utils";

export default abstract class WidgetContainerElement extends WidgetElement {

    data: WidgetElement[];
    constructor(values?: any) { super(values); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        const children = this.data ? this.data.map((child: WidgetElement) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview(),
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canCopy: constructor.copyable,
            children,
            cssClass: Utils.toKebabCase(constructor.name)
        });
    }

    static hasChildren(): boolean { return true; }

}