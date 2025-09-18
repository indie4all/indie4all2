import { injectable } from "inversify";
import ContainerManager from "../../../../container.manager";
import ColumnsLayoutElement from "../../../elements/columns-layout/columns-layout.element";
import Action from "./action";
import AddElementAction from "./add-element.action";
import RemoveElementAction from "./remove-element.action";

@injectable()
export default class MoveContainerAction extends Action {

    private async move(target: { id: string; index: string | number; position: number; }) {
        // Remove element from current location
        (this._actionFactory(RemoveElementAction, this._model, this._data)).do();
        // Add element to the target location   
        const targetParent = this._model.findObject(target.id);
        const siblings = (targetParent instanceof ColumnsLayoutElement) ? targetParent.data[target.index] : targetParent.data;
        const inPosition: string = (target.position == -1 || siblings.length == 0 || target.position >= siblings.length) ?
            null : siblings[target.position].id;
        (this._actionFactory(AddElementAction, this._model, {
            element: this._data.element,
            parentContainerId: target.id,
            parentContainerIndex: target.index,
            inPositionElementId: inPosition
        })).do();
    }

    async do() { await this.move(this._data.target); }

    async undo() { await this.move(this._data.source); }
}