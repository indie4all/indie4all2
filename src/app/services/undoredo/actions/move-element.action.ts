import { injectable } from "inversify";
import ContainerManager from "../../../../container.manager";
import { Model } from "../../../elements/model";
import Action from "./action";
import MoveContainerAction from "./move-container.action";

@injectable()
export default class MoveElementAction extends Action {

    action: MoveContainerAction;

    constructor() { super(); }

    init(model: Model, data: any) {
        super.init(model, data);
        const source = {
            id: data.containerId,
            type: data.containerType,
            position: data.initialPosition,
            index: data.containerIndex
        }
        const target = {
            id: data.containerId,
            type: data.containerType,
            position: data.finalPosition,
            index: data.containerIndex
        }

        this.action = this._actionFactory(MoveContainerAction, this._model, {
            source, target, element: data.element
        });
    }

    async do() { await this.action.do(); }

    async undo() { await this.action.undo(); }
}