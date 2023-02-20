import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import "./styles.scss"

export default abstract class WidgetColumnsLayout extends WidgetElement {

    protected static columns: number[];

    data: WidgetElement[][];

    constructor(values: any) { super(values); }

    createElement(): string {

        const children = this.data ?
            this.data.map(child => child.map((subchild: WidgetElement) => subchild.createElement()).join("")) :
            Array.from(" ".repeat(WidgetColumnsLayout.columns.length));

        const constructor = <typeof WidgetElement>this.constructor;
        return template({
            id: this.id,
            type: constructor.type,
            widget: constructor.widget,
            icon: constructor.icon,
            columns: WidgetColumnsLayout.columns,
            canEdit: constructor.editable,
            children
        });
    }

    static hasChildren(): boolean { return true; }

    preview(): string {
        return this.translate("widgets.ColumnLayout.label")
    }

    regenerateIDs(): void {
        super.regenerateIDs();
        this.data.flat().forEach(child => child.regenerateIDs());
    }

    validateForm(form: any): string[] { return []; }

    validateModel(): string[] {
        let error = this.data.find(elem => elem.length == 0);
        if (error) return ["ColumnLayout.data.empty"];
        return [];
    }


}