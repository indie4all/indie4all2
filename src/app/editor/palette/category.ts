
import { injectable } from "inversify";
import WidgetElement from "../../elements/widget/widget.element";
import CategoryItem from "./category-item";
import ContainerManager from "../../../container.manager";

@injectable()
export default class Category {
    private _name: string;
    private _items: CategoryItem[];
    private _hidden: boolean = false;
    private _injector: ContainerManager = ContainerManager.instance;

    constructor() { }

    public async init(name: string, widgets: typeof WidgetElement[]) {
        this._name = name;
        this._items = await Promise.all(widgets.map(async widget => {
            const item = this._injector.get(CategoryItem) as CategoryItem;
            await item.init(widget);
            item.visibility.subscribe(visible => {
                // Hide the whole category if all items are hidden
                this._items.every(item => !item.visible) ? this.hide() : this.show();
            });
            return item;
        }));
    }

    public async render(): Promise<string> {
        const { default: template } = await import("./template.hbs");
        return template({
            title: "palette." + this._name,
            name: this._name,
            numWidgets: this._items.length,
            widgets: (await Promise.all(this._items.map(async item => item.render()))).join('')
        });
    }

    toggle() {
        const icon = document.querySelector("[data-category-header='" + this._name + "'] [data-icon]");
        icon.classList.toggle("fa-caret-down", !this._hidden);
        icon.classList.toggle("fa-caret-up", this._hidden);
        document.querySelectorAll("[data-category='" + this._name + "']")
            .forEach(element => element.classList.toggle("d-none", !this._hidden));
        this._hidden = !this._hidden;
    }

    hide() {
        document.querySelector("[data-category-header='" + this._name + "']").classList.add("d-none");
    }

    show() {
        document.querySelector("[data-category-header='" + this._name + "']").classList.remove("d-none");
    }

    findItem(widget: string): CategoryItem {
        return this._items.find(item => item.widget === widget);
    }

    get name() {
        return this._name;
    }
}