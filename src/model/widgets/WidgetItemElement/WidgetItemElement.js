import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default class WidgetItemElement extends WidgetElement {
    
    createElement(widget) {
        const label = this.preview(widget);
        const canEdit = this.config.toolbar.edit;
        const canCopy = this.config.type !== 'specific-element';
        return template({...this.config, label, canEdit, canCopy, id: widget.id});
    }
}