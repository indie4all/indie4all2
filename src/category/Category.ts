
/* global $ */
import WidgetElement from "../model/widgets/WidgetElement/WidgetElement";
import template from "./template.hbs"

export default class Category {
    name: string;
    widgets: typeof WidgetElement[];
    hidden: boolean;

    constructor(name: string, widgets: typeof WidgetElement[]) {
        this.name = name;
        this.widgets = widgets;
        this.hidden = false;
    }

    render(): string {
        return template({
            title: "palette." + this.name,
            name: this.name,
            numWidgets: this.widgets.length,
            widgets: this.widgets.map(widget => widget.createPaletteItem()).join('')
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