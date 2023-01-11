/* global $ */
import Utils from "../Utils";
import ActionElement from "./ActionElement";

export default class ActionMoveElement extends ActionElement {

    #move(data, from, to) {
        const containerType = data.containerType;
        const containerId = data.containerId;
        const containerIndex = data.containerIndex;
        const initialPosition = from;
        const finalPosition = to;
        var parentContainer = this.model.findObject(containerId);
        let initialModel, finalModel;
        if (containerType == 'layout') {
            initialModel = parentContainer.data[containerIndex][initialPosition];
            finalModel = parentContainer.data[containerIndex][finalPosition];
            // Model move
            Utils.array_move(parentContainer.data[containerIndex], initialPosition, finalPosition);
        } else {
            initialModel = parentContainer.data[initialPosition];
            finalModel = parentContainer.data[finalPosition];
            // Model move
            Utils.array_move(parentContainer.data, initialPosition, finalPosition);
        }

        var initialElement = document.querySelector("[data-id='" + initialModel.id + "']").parentNode;
        var finalElement = document.querySelector("[data-id='" + finalModel.id + "']").parentNode;

        // View move
        if (initialPosition < finalPosition) {
            $(initialElement).insertAfter(finalElement)
        } else {
            $(initialElement).insertBefore(finalElement);
        }
    }

    do() {
        this.#move(this.data, this.data.initialPosition, this.data.finalPosition);
    }

    undo() {
        this.#move(this.data, this.data.finalPosition, this.data.initialPosition);
    }
}
