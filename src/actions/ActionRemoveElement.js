/* global $ */
import ActionAddElement from "./ActionAddElement";
import ActionElement from "./ActionElement";

export default class ActionRemoveElement extends ActionElement {

    do() {
        this.model.removeElement(this.modelId);
        $(document.querySelector("[data-id='" + this.modelId + "']").parentNode).remove();
    }

    undo() {
        (new ActionAddElement(this.modelId, this.container, this.model, this.data)).do();
    }
}