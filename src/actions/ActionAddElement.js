/* global $ */
import ModelManager from "../model/ModelManager";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionAddElement extends ActionElement {

    constructor(id, container, model, data) {
        super(id, container, model, data);
        this.element = data.element;
        this.parentType = data.parentType;
        this.parentContainerId = data.parentContainerId;
        this.parentContainerIndex = data.parentContainerIndex;
        this.inPositionElementId = data.inPositionElementId;
        this.parentContainer = document.querySelector("[data-id='" + this.parentContainerId + "']");
        this.parentElement = this.model.findObject(this.parentContainerId);
    }

    do() {
        const view = ModelManager.getWidget(this.element.widget).createElement(this.element);
        let target;
        if (this.parentElement.type == 'layout')
            target = this.parentContainer.querySelector('[data-index="' + this.parentContainerIndex + '"');
        else
            target = this.parentContainer.querySelector('[data-content]');

        if (this.inPositionElementId != -1) {
            const targetItem = $(target).find('.container-item [data-id="' + this.inPositionElementId + '"]');
            const closestItemContent = $(targetItem).parent();
            $(closestItemContent).before(view);
        } else {
            $(target).append(view);
        }

        if (this.parentType == 'layout')
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        else
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId);
    }

    undo() {
        (new ActionRemoveElement(this.modelId, this.container, this.model, this.data)).do();
    }
}