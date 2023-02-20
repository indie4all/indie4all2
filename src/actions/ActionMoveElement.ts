import { Model } from "../model/Model";
import ActionElement from "./ActionElement";
import ActionMoveContainer from "./ActionMoveContainer";

export default class ActionMoveElement extends ActionElement {

    action: ActionMoveContainer;

    constructor(model: Model, data: any) {
        super(model, data);
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

        this.action = new ActionMoveContainer(this.model, {
            source, target, element: data.element
        });
    }

    do() { this.action.do(); }

    undo() { this.action.undo(); }
}