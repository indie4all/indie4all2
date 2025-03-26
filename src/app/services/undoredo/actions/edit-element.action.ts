import { inject, injectable } from "inversify";
import { Model } from "../../../elements/model";
import Action from "./action";
import TooltipService from "../../tooltip/tooltip.service";

@injectable()
export default class EditElementAction extends Action {

    dataBefore: any;
    dataNow: any;

    @inject(TooltipService) private _tooltip: TooltipService;

    constructor() { super(); }

    init(model: Model, data: any) {
        super.init(model, data);
        this.dataBefore = data.before;
        this.dataNow = data.now;
    }

    private async load(data: any) {
        const element = this._model.findObject(data.id);
        await element.init(data);
        const elemHTML = document.querySelector('[data-id="' + data.id + '"]');
        const preview = elemHTML.querySelector('[data-prev]') as HTMLElement;
        preview.innerHTML = element.preview;
        // Remove errors if exist
        await this._tooltip.dispose(preview);
        elemHTML.parentNode && (elemHTML.parentNode as HTMLElement).classList.remove('editor-error');
    }

    async do() { await this.load(this.dataNow); }

    async undo() { await this.load(this.dataBefore); }
}