/* global $ */
import ActionAddSection from "./ActionAddSection";
import ActionElement from "./ActionElement";

export default class ActionRemoveSection extends ActionElement {

    do() {
        this.model.removeElement(this.data.element.id);
        $(document.getElementById("sec-" + this.data.element.id).parentNode).remove();
    }

    undo() {
        (new ActionAddSection(this.container, this.model, this.data)).do();
    }
}