import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import "./styles.scss"

export default class WidgetColumnsLayout extends WidgetElement {

    constructor(values) { super(values); }

    createElement() {
        const id = this.id;
        const type = this.type;
        const widget = this.widget;
        const icon = this.constructor.icon;
        const columns = this.constructor.columns;

        const canEdit = this.constructor.toolbar.edit;
        const children = this.data ?
            this.data.map(child => child.map(subchild => subchild.createElement()).join("")) : 
            Array.from(" ".repeat(this.constructor.columns.length));
        return template({id, type, widget, icon, columns, canEdit, children });
    }
    
    hasChildren() { return true; }

    preview() {
        return this.translate("widgets.ColumnLayout.label")
    }

    
    regenerateIDs() {
        super.regenerateIDs();
        this.data ?? this.data.flat().forEach(child => child.regenerateIDs());
    }

    validateModel() {
        let error = this.data.find(elem => elem.length == 0);
        if (error) return ["ColumnLayout.data.empty"];
        return [];
    }

    validateForm(form) { return []; }
}