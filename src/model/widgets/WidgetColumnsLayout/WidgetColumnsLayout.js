import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";

export default class WidgetColumnsLayout extends WidgetElement {

    createElement(widget) {
        const canEdit = this.config.toolbar.edit;
        return template({...this.config, canEdit, id: widget.id});
    }
    
    hasChildren() { return true; }

    preview(model) {
        return this.translate("widgets.ColumnLayout.label")
    }

    validateModel(widget) {
        let error = widget.data.find(elem => elem.length == 0);
        if (error) return ["ColumnLayout.data.empty"];
        return [];
    }

    validateForm(form) { return []; }
}