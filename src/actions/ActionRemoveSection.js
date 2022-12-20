/* global $ */
import ActionAddSection from "./ActionAddSection";
import ActionElement from "./ActionElement";

export default class ActionRemoveSection extends ActionElement {

    do() {
        //indieauthor.deleteToolTipError(document.getElementById("sec-" + id).querySelector('[data-prev]'));
        this.model.removeElement(this.modelId);
        $(document.getElementById("sec-" + this.modelId).parentNode).remove();
    }

    undo() {
        (new ActionAddSection(this.modelId, this.container, this.model, this.data)).do();
    }
}