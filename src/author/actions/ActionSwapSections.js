/* global $ */
import Utils from "../Utils";
import ActionElement from "./ActionElement";

export default class ActionSwapSections extends ActionElement {

    #swap(sectionOriginId, direction) {
        var positionQuery = (direction == 1) ? $(document.getElementById("sec-" + sectionOriginId).parentNode).prev() : $(document.getElementById("sec-" + sectionOriginId).parentNode).next();
        if (positionQuery.length == 1) {
            var targetOrigin = positionQuery[0].firstElementChild.dataset.id;
            Utils.swap(document.getElementById("sec-" + sectionOriginId).parentNode, document.getElementById("sec-" + targetOrigin).parentNode);
            this.model.swap(sectionOriginId, targetOrigin);
        }
    }

    do() {
        this.#swap(this.data.sectionOriginId, this.data.direction);
    }

    undo() {
        const oppositeDirection = (this.data.direction == 1) ? 0 : 1;
        this.#swap(this.data.sectionOriginId, oppositeDirection);
    }
}