
import template from "./template.hbs";
import Element from "../element/element";
import WidgetElement from "../widget/widget.element";

export default abstract class ContainerElement extends WidgetElement {

    data: Element[];

    constructor() { super(); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        const children = this.data ? this.data.map((child: WidgetElement) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview,
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            canGenerate: constructor.generable,
            children,
            cssClass: this.utils.toKebabCase(constructor.name)
        });
    }

    static hasChildren(): boolean { return true; }

    get texts(): any {
        return {
            "help": this.params.help,
            "name": this.params.name,
            "children": this.data.map(child => child.texts)
        }
    }

    set texts(texts: any) {
        this.params.help = texts.help;
        this.params.name = texts.name;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].texts = text);
    }

}