import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import './styles.scss';

export default class WidgetColumnsLayout extends WidgetElement {

    createElement(widget) {
        const canEdit = this.config.toolbar.edit;
        return template({
            type: this.config.type,
            widget: this.config.widget,
            id: widget.id,
            icon: this.config.icon,
            columns: this.config.columns,
            canEdit
        });
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