import WidgetElement from "../WidgetElement/WidgetElement";
import template from "./template.hbs";

export default class WidgetItemElement extends WidgetElement {

    constructor(values) { super(values); }
    
    createElement() {
        const label = this.preview();
        const icon = this.constructor.icon;
        const canEdit = this.constructor.toolbar.edit;
        const canCopy = this.type !== 'specific-element';
        const cssClass = this.constructor.cssClass;
        
        return template({cssClass, type: this.type, widget: this.widget, id: this.id, icon, label, canEdit, canCopy });
    }
}