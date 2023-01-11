import ModelManager from "../../ModelManager";
import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default class WidgetContainerElement extends WidgetElement {

    createElement(widget) {
        const label = this.preview(widget);
        const canAdd = this.config.type == 'specific-container' || this.config.type == 'specific-element-container';
        const canEdit = this.config.toolbar.edit;
        const canCopy = this.config.type !== 'specific-element';
        const children = widget.data ? 
            widget.data.map(child => ModelManager.getWidget(child.widget).createElement(child)).join('') : "";
        return template({...this.config, label, canAdd, canEdit, canCopy, id: widget.id, children});
    }

    hasChildren() { return true; }
}