import { injectable } from "inversify";
import Editor from "./editor";
import SectionElement from "../elements/section/section.element";
import WidgetElement from "../elements/widget/widget.element";

@injectable()
export default class WidgetEditor extends Editor {

    public async load(element?: any, onLoaded?: Function) {
        try {
            if (element) {
                await this._loading.show();
                // Do not allow the user to modify the default section
                SectionElement.deletable = false;
                SectionElement.copyable = false;
                SectionElement.editable = false;
                SectionElement.movable = false;
                // Configure the available options that we have for the widget
                const widgetPrototype = this._injector.getElement(element.widget) as typeof WidgetElement;
                widgetPrototype.deletable = false
                widgetPrototype.copyable = false;
                // Hide all the widgets by default in the palette
                this._injector.allWidgets.map(ele => this._palette.findItem(ele.widget)?.hide());
                // Show only the widgets that are allowed in the current widget
                const allowedWidgets = this._injector.getAllWidgetsAllowedIn(element.widget);
                allowedWidgets.map(ele => this._palette.findItem(ele.widget)?.show());
                // Initialize the section and the widget with default fields if not initialized
                const section = this._injector.get(SectionElement) as SectionElement;
                await section.init({ data: [element] });
                const model = { sections: [section.toJSON()] };
                await this._model.init(model);
                // Do not allow the user to add new widgets to the section
                this._injector.addRule("Section", { rejects: [WidgetElement] });
                await this._loading.hide();
            }
            this._containerElem.innerHTML = '';
            this._dragDrop.model = this._model;
            this._model.sectionsHTML.forEach(html => this._containerElem.insertAdjacentHTML('beforeend', html));
            onLoaded && onLoaded();
        } catch (err) {
            console.error(err);
            this._containerElem.innerHTML = '';
            await this._loading.hide();
            $(this._containerElem).empty();
            await this._model.init({});
            this._utils.notifyError(this._i18n.value("messages.loadError"));
        }
    }
}