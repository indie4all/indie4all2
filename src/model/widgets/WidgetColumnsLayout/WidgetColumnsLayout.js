import template from "./template.hbs"
import WidgetElement from "../WidgetElement/WidgetElement";
import ModelManager from "../../ModelManager";
import "./styles.scss"

export default class WidgetColumnsLayout extends WidgetElement {

    createElement(widget) {
        const canEdit = this.config.toolbar.edit;
        const children = widget.data ?
            widget.data.map(child =>
                child.map(subchild => ModelManager.getWidget(subchild.widget).createElement(subchild)).join("")
            ) : Array.from(" ".repeat(this.config.columns.length));
        return template({...this.config, canEdit, id: widget.id, children });
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