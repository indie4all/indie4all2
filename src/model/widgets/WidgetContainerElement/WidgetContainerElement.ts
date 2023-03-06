import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetElement from "../WidgetElement/WidgetElement";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import ModelElement from "../../ModelElement";
import template from "./template.hbs";

export default abstract class WidgetContainerElement extends WidgetElement {

    static allows(): (abstract new (...args: any[]) => ModelElement)[] {
        return [WidgetItemElement, WidgetColumnsLayout, WidgetContainerSpecificElement];
    }

    static refuses() { return [WidgetSpecificItemElement, WidgetContainerSpecificElement]; }

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
            children
        });
    }

    static hasChildren(): boolean { return true; }

}