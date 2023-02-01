
/* global $ */
import template from "./template.hbs"

export default class Category {

    constructor(name, widgets) {
        this.name = name;
        this.widgets = widgets;
        this.hidden = false;
    }

    render() {
        const filtered = this.widgets.filter(widget => !widget.paletteHidden);
        return template({ 
             title: "palette." + this.name, 
             name: this.name, 
             numWidgets: filtered.length,
             widgets: filtered.map(widget => widget.createPaletteItem()).join('')
        });
    }

    toggle() {
        const $icon = $("[data-category-header='" + this.name + "'] [data-icon]");
        $icon.toggleClass("fa-caret-down", !this.hidden);
        $icon.toggleClass("fa-caret-up", this.hidden);
        $("[data-category=" + this.name + "]").toggle(this.hidden);
        this.hidden = !this.hidden;
    }
}