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
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            children,
            cssClass: Utils.toKebabCase(constructor.name)
        });
    }

    static hasChildren(): boolean { return true; }

    getTexts(): any {
        return {
            "help": this.params.help,
            "name": this.params.name,
            "children": this.data.map(child => child.getTexts())
        }
    }

    updateTexts(texts: any): void {
        this.params.help = texts.help;
        this.params.name = texts.name;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].updateTexts(text));
    }

}