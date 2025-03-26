
import template from "./template.hbs";
import WidgetElement from "../widget/widget.element";
import Config from "../../../config";

export default abstract class ItemElement extends WidgetElement {

    protected static _generable: boolean = true;

    constructor() { super(); }

    createElement(): string {
        const constructor = <typeof WidgetElement>this.constructor;
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            canCopy: constructor.copyable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canGenerate: !!Config.getAIURL() && constructor.generable,
            cssClass: this.utils.toKebabCase(constructor.name),
            label: this.preview
        });
    }
}