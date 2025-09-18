import { injectable } from "inversify";
import { Model } from "../../../elements/model";
import Action from "./action";

@injectable()
export default class UpdateElementAction extends Action {

    dataBefore: any;
    dataNow: any;

    constructor() { super(); }

    init(model: Model, data: any) {
        super.init(model, data);
        this.dataBefore = data.before;
        this.dataNow = data.now;
    }

    private async load(data: any) {
        const element = this._model.findObject(data.id);
        await element.init(data);
        const elemHTML = document.querySelector('[data-id="' + data.id + '"]') as HTMLElement;
        const container = elemHTML.parentElement;
        container.insertAdjacentHTML('afterend', element.createElement());
        container.remove();
    }

    async do() { await this.load(this.dataNow); }

    async undo() { await this.load(this.dataBefore); }
}