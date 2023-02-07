import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default class WidgetContainerElement extends WidgetElement {

    constructor(values) { super(values); }

    createElement() {
        const icon = this.constructor.icon;
        const label = this.preview();
        const canAdd = this.type == 'specific-container' || this.type == 'specific-element-container';
        const canEdit = this.constructor.toolbar.edit;
        const canCopy = this.type !== 'specific-element' && this.type !== 'element-container';
        const children = this.data ? this.data.map(child => child.createElement()).join('') : "";
        return template({id: this.id, type: this.type, widget: this.widget, icon, label, canAdd, canEdit, canCopy, children});
    }

    hasChildren() { return true; }

    regenerateIDs() {
        super.regenerateIDs();
        this.data && this.data.forEach(child => child.regenerateIDs());
    }

}