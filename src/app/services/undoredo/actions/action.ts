import { inject, injectable } from "inversify";
import { Model } from "../../../elements/model";

@injectable()
export default abstract class Action {
    protected _model: Model;
    protected _data: any;
    @inject('Factory<Action>')
    protected _actionFactory: <T extends Action>(typeAction: new () => T, model: Model, data: any) => T;

    constructor() { }

    init(model: Model, data: any): void {
        this._model = model;
        this._data = data;
    }

    abstract do(): Promise<void>;
    abstract undo(): Promise<void>;
}