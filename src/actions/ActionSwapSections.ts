/* global $ */
import Utils from "../Utils";
import ActionElement from "./ActionElement";

export default class ActionSwapSections extends ActionElement {

    private swap(sectionOriginId: string, direction: number) {
        const node = <HTMLElement>document.getElementById("sec-" + sectionOriginId);
        const parent = <HTMLElement>node.parentNode;
        var positionQuery = (direction == 1) ? $(parent).prev() : $(parent).next();
        if (positionQuery.length == 1) {
            var targetOrigin: string = <string>(<HTMLElement>(<HTMLElement>positionQuery.get(0)).firstElementChild).dataset.id;
            const srcNode = <HTMLElement>document.getElementById("sec-" + sectionOriginId);
            const tgtNode = <HTMLElement>document.getElementById("sec-" + targetOrigin);
            Utils.swap(<HTMLElement>srcNode.parentNode, <HTMLElement>tgtNode.parentNode);
            this.model.swap(sectionOriginId, targetOrigin);
        }
    }

    do() {
        this.swap(this.data.sectionOriginId, this.data.direction);
    }

    undo() {
        const oppositeDirection = (this.data.direction == 1) ? 0 : 1;
        this.swap(this.data.sectionOriginId, oppositeDirection);
    }
}