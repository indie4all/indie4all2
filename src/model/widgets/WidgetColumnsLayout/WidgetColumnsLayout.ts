import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import "./styles.scss";

export default abstract class WidgetColumnsLayout extends WidgetElement {

    protected static columns: number[];

    data: WidgetElement[][];

    constructor(values?: any) { super(values); }

    createElement(): string {
        const constructor = <typeof WidgetColumnsLayout>this.constructor;
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

    getTexts() {
        return { "columns": this.data.map(column => ({ "children": column.map(child => child.getTexts()) })) };
    }

    static hasChildren(): boolean { return true; }

    preview(): string {
        return this.translate("widgets.ColumnLayout.label")
    }

    updateTexts(texts: any): void {
        (texts.columns as any[]).forEach(
            (textCol, idxCol) => (textCol.children as any[]).forEach((text, idx) => this.data[idxCol][idx].updateTexts(text)));
    }

    validateForm(form: any): string[] { return []; }

    validateModel(): string[] {
        let error = this.data.find(elem => elem.length == 0);
        if (error) return ["ColumnLayout.data.empty"];
        return [];
    }


}