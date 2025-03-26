import { injectable } from "inversify";
import ColumnsLayoutElement from "../../../elements/columns-layout/columns-layout.element";
import Element from "../../../elements/element/element";
import { Model } from "../../../elements/model";
import Action from "./action";
import ActionRemoveElement from "./remove-element.action";

@injectable()
export default class AddElementAction extends Action {

    element: Element;
    parentContainerId: string;
    parentContainerIndex: number;
    inPositionElementId: string;

    constructor() { super(); }

    init(model: Model, data: any) {
        super.init(model, data);
        this.element = data.element;
        this.parentContainerId = data.parentContainerId;
        this.parentContainerIndex = data.parentContainerIndex;
        this.inPositionElementId = data.inPositionElementId;
    }

    async do() {
        const parentContainer: HTMLElement = <HTMLElement>document.querySelector("[data-id='" + this.parentContainerId + "']");
        const parentElement = this._model.findObject(this.parentContainerId);
        const view = this.element.createElement();
        let target: HTMLElement;
        if (parentElement instanceof ColumnsLayoutElement) {
            target = <HTMLElement>parentContainer.querySelector('[data-index="' + this.parentContainerIndex + '"');
            this._model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        } else {
            target = <HTMLElement>parentContainer.querySelector('[data-content]');
            this._model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        }

        if (this.inPositionElementId) {
            const targetItem = $(target).find('.container-item [data-id="' + this.inPositionElementId + '"]');
            const closestItemContent = $(targetItem).parent();
            $(closestItemContent).before(view);
        } else {
            $(target).append(view);
        }
    }

    async undo() { (this._actionFactory(ActionRemoveElement, this._model, this._data)).do(); }
}