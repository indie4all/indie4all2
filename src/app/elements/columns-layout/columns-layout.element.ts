import template from "./template.hbs"
import "./styles.scss";
import WidgetElement from "../widget/widget.element";

export default abstract class ColumnsLayoutElement extends WidgetElement {

    protected static _generable: boolean = true;
    protected static columns: number[];

    data: WidgetElement[][];

    constructor() { super(); }

    createElement(): string {
        const constructor = this.constructor as typeof ColumnsLayoutElement;
        const children = this.data ?
            this.data.map(child => child.map((subchild: WidgetElement) => subchild.createElement()).join("")) :
            Array.from(" ".repeat(constructor.columns.length));

        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            columns: constructor.columns,
            canEdit: constructor.editable,
            canCopy: constructor.copyable,
            canDelete: constructor.deletable,
            children
        });
    }

    get texts() { return { "columns": this.data.map(column => ({ "children": column.map(child => child.texts) })) }; }

    static hasChildren(): boolean { return true; }

    get preview() { return this.translate("widgets.ColumnLayout.label") }

    set texts(texts: any) {
        (texts.columns as any[]).forEach(
            (textCol, idxCol) => (textCol.children as any[]).forEach((text, idx) => this.data[idxCol][idx].texts = text));
    }

    validateForm(form: any): string[] { return []; }

    validateModel(): string[] {
        let error = this.data.find(elem => elem.length == 0);
        if (error) return ["ColumnLayout.data.empty"];
        return [];
    }


}