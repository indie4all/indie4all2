import { inject, injectable } from "inversify";
import WidgetElement from "../../elements/widget/widget.element";
import Category from "./category";
import CategoryItem from "./category-item";
import ContainerManager from "../../../container.manager";
import UtilsService from "../../services/utils/utils.service";

@injectable()
export default class Palette {

    private _categories: { [name: string]: Category } = {};
    private _injector: ContainerManager = ContainerManager.instance;

    constructor(@inject(UtilsService) private utils: UtilsService) { }

    async init(palette: HTMLElement, widgets: typeof WidgetElement[]): Promise<void> {
        const groups = this.utils.groupBy({ collection: widgets.filter(widget => widget.category), key: "category" });
        this._categories = Object.fromEntries(await Promise.all(Object.entries(groups).map(async ([name, widgets]) => {
            const category = this._injector.get(Category) as Category;
            await category.init(name, widgets);
            return [name, category];
        })));
        palette.innerHTML = (await Promise.all(Object.values(this._categories).map(category => category.render()))).join('');
        Object.keys(this._categories).forEach(name => {
            const header = document.querySelector("[data-category-header='" + name + "']");
            header.addEventListener("click", () => this._categories[name].toggle());
        });
    }

    public get categories(): { [name: string]: Category } {
        return this._categories;
    }

    public findItem(widget: string): CategoryItem {
        return Object.values(this._categories).map(category => category.findItem(widget)).find(item => item);
    }
}