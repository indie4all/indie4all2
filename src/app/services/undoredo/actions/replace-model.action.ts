import { inject, injectable } from "inversify";
import { Model } from "../../../elements/model";
import Action from "./action";
import DragDropService from "../../drag-drop/drag-drop.service";

@injectable()
export default class ReplaceModelAction extends Action {

    @inject(DragDropService) private _dragDrop: DragDropService;

    dataBefore: any;
    dataNow: any;
    container: HTMLElement;

    constructor() { super(); }

    init(model: Model, data: any) {
        super.init(model, data);
        this.dataBefore = data.before;
        this.dataNow = data.now;
        this.container = data.container;
    }

    private async load(data: any) {
        await this._model.init(data);
        this.container.innerHTML = '';
        this._dragDrop.model = this._model;
        this._model.sections.forEach(section => this.container.insertAdjacentHTML('beforeend', section.createElement()));
    }

    async do() { await this.load(this.dataNow); }

    async undo() { await this.load(this.dataBefore); }
}