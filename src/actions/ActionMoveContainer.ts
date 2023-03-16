import WidgetColumnsLayout from "../model/widgets/WidgetColumnsLayout/WidgetColumnsLayout";
import ActionAddElement from "./ActionAddElement";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionMoveContainer extends ActionElement {

    private move(target: { id: string; index: string | number; position: number; }) {
        // Remove element from current location
        (new ActionRemoveElement(this.model, this.data)).do();
        // Add element to the target location   
        const targetParent = this.model.findObject(target.id);
        const siblings = (targetParent instanceof WidgetColumnsLayout) ? targetParent.data[target.index] : targetParent.data;
        const inPosition: string = (target.position == -1 || siblings.length == 0 || target.position >= siblings.length) ?
            null : siblings[target.position].id;

        (new ActionAddElement(this.model,
            {
                element: this.data.element,
                parentContainerId: target.id,
                parentContainerIndex: target.index,
                inPositionElementId: inPosition
            })).do()
    }

    do() { this.move(this.data.target); }

    undo() { this.move(this.data.source); }
}