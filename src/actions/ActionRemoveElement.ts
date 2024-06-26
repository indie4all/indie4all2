/* global $ */
import ActionAddElement from "./ActionAddElement";
import ActionElement from "./ActionElement";

export default class ActionRemoveElement extends ActionElement {

    do() {
        this.model.removeElement(this.data.element.id);
        $(<HTMLElement>document.querySelector("[data-id='" + this.data.element.id + "']")).parent().remove();
    }

    undo() {
        (new ActionAddElement(this.model, this.data)).do();
    }
}