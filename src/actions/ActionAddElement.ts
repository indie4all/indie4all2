/* global $ */
import { Model } from "../model/Model";
import WidgetColumnsLayout from "../model/widgets/WidgetColumnsLayout/WidgetColumnsLayout";
import WidgetElement from "../model/widgets/WidgetElement/WidgetElement";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionAddElement extends ActionElement {

    element: WidgetElement;
    parentContainerId: string;
    parentContainerIndex: number;
    inPositionElementId: string;

    constructor(model: Model, data: any) {
        super(model, data);
        this.element = data.element;
        this.parentContainerId = data.parentContainerId;
        this.parentContainerIndex = data.parentContainerIndex;
        this.inPositionElementId = data.inPositionElementId;
    }

    do() {

        const parentContainer: HTMLElement = <HTMLElement>document.querySelector("[data-id='" + this.parentContainerId + "']");
        const parentElement = this.model.findObject(this.parentContainerId);
        const view = this.element.createElement();
        let target: HTMLElement;
        if (parentElement instanceof WidgetColumnsLayout) {
            target = <HTMLElement>parentContainer.querySelector('[data-index="' + this.parentContainerIndex + '"');
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        } else {
            target = <HTMLElement>parentContainer.querySelector('[data-content]');
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        }

        if (this.inPositionElementId) {
            const targetItem = $(target).find('.container-item [data-id="' + this.inPositionElementId + '"]');
            const closestItemContent = $(targetItem).parent();
            $(closestItemContent).before(view);
        } else {
            $(target).append(view);
        }
    }

    undo() {
        (new ActionRemoveElement(this.model, this.data)).do();
    }
}