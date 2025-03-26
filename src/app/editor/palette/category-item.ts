import { inject, injectable } from "inversify";
import WidgetElement from "../../elements/widget/widget.element";
import I18nService from "../../services/i18n/i18n.service";
import { Subject } from "rxjs";

@injectable()
export default class CategoryItem {

    private _element: typeof WidgetElement;
    private _visible: boolean = true;

    private visibilitySubject = new Subject<boolean>();
    public visibility$ = this.visibilitySubject.asObservable();

    constructor(@inject(I18nService) private _i18n: I18nService) { }

    public async init(widget: typeof WidgetElement) {
        this._element = widget;
    }

    async render(): Promise<string> {
        const { default: template } = await import("./template-item.hbs");
        return template({
            cat: this._element.category,
            widget: this._element.widget,
            icon: this._element.icon,
            label: this._i18n.value(`widgets.${this._element.widget ?? "GenericWidget"}.label`)
        });
    }

    hide() {
        const item = document.querySelector(".palette-item[data-widget='" + this._element.widget + "']");
        item.classList.add("d-none");
        this._visible = false;
        this.visibilitySubject.next(false);
    }

    show() {
        const item = document.querySelector(".palette-item[data-widget='" + this._element.widget + "']");
        item.classList.remove("d-none");
        this._visible = true;
        this.visibilitySubject.next(true);
    }

    get widget() { return this._element.widget }

    get visibility() { return this.visibility$; }

    get visible() { return this._visible; }
}