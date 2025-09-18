import { injectable } from "inversify";
import Editor from "./editor";

@injectable()
export default class UnitEditor extends Editor {

    constructor() { super(); }

    async init(): Promise<void> {
        await super.init();
    }

    async load(model?: object, onLoaded?: Function) {
        try {
            if (model) {
                await this._loading.show();
                await this._model.init(model);
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