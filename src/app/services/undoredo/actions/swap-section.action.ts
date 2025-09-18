import { injectable } from "inversify";
import Action from "./action";
import UtilsService from "../../utils/utils.service";
import ContainerManager from "../../../../container.manager";

@injectable()
export default class SwapSectionsAction extends Action {

    private async swap(sectionOriginId: string, direction: number) {
        const node = <HTMLElement>document.getElementById("sec-" + sectionOriginId);
        const parent = <HTMLElement>node.parentNode;
        var positionQuery = (direction == 1) ? $(parent).prev() : $(parent).next();
        if (positionQuery.length == 1) {
            var targetOrigin: string = <string>(<HTMLElement>(<HTMLElement>positionQuery.get(0)).firstElementChild).dataset.id;
            const srcNode = <HTMLElement>document.getElementById("sec-" + sectionOriginId);
            const tgtNode = <HTMLElement>document.getElementById("sec-" + targetOrigin);
            // TODO: change this
            const utils = ContainerManager.instance.get(UtilsService);
            utils.swap(<HTMLElement>srcNode.parentNode, <HTMLElement>tgtNode.parentNode);
            this._model.swap(sectionOriginId, targetOrigin);
        }
    }

    async do() {
        this.swap(this._data.sectionOriginId, this._data.direction);
    }

    async undo() {
        const oppositeDirection = (this._data.direction == 1) ? 0 : 1;
        this.swap(this._data.sectionOriginId, oppositeDirection);
    }
}