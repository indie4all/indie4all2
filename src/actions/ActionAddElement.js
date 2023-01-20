/* global $ */
import ModelManager from "../model/ModelManager";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionAddElement extends ActionElement {

    constructor(model, data) {
        super(model, data);
        this.element = data.element;
        this.parentContainerId = data.parentContainerId;
        this.parentContainerIndex = data.parentContainerIndex;
        this.inPositionElementId = data.inPositionElementId;
    }

    do() {

        const parentContainer = document.querySelector("[data-id='" + this.parentContainerId + "']");
        const parentElement = this.model.findObject(this.parentContainerId);
        const view = ModelManager.getWidget(this.element.widget).createElement(this.element);
        let target;
        if (parentElement.type == 'layout') {
            target = parentContainer.querySelector('[data-index="' + this.parentContainerIndex + '"');
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        } else {
            target = parentContainer.querySelector('[data-content]');
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId);
        }

        if (this.inPositionElementId != -1) {
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