import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default abstract class WidgetContainerElement extends WidgetElement {

    data: WidgetElement[];
    static allow: string[];

    constructor(values: any) { super(values); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        const canAdd = WidgetContainerElement.type == 'specific-container' || WidgetContainerElement.type == 'specific-element-container';
        const canCopy = WidgetContainerElement.type !== 'specific-element' && WidgetContainerElement.type !== 'element-container';
        const children = this.data ? this.data.map((child: WidgetElement) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            type: constructor.type,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview(),
            canAdd,
            canCopy,
            children
        });
    }

    static hasChildren(): boolean { return true; }

    regenerateIDs(): void {
        super.regenerateIDs();
        this.data && this.data.forEach(child => child.regenerateIDs());
    }

}