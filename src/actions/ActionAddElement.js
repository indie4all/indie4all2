/* global $ */
import ModelManager from "../model/ModelManager";
import ActionElement from "./ActionElement";
import ActionRemoveElement from "./ActionRemoveElement";

export default class ActionAddElement extends ActionElement {

    constructor(id, container, model, data) {
        super(id, container, model, data);
        this.view = this.clearElement(data.view);
        this.element = data.element;
        this.parentType = data.parentType;
        this.parentContainerId = data.parentContainerId;
        this.parentContainerIndex = data.parentContainerIndex;
        this.inPositionElementId = data.inPositionElementId;
        this.parentContainer = document.querySelector("[data-id='" + this.parentContainerId + "']");
        this.parentElement = this.model.findObject(this.parentContainerId);
    }

    do() {
        let target;
        if (this.parentElement.type == 'layout')
            target = this.parentContainer.querySelector('[data-index="' + this.parentContainerIndex + '"');
        else
            target = this.parentContainer.querySelector('[data-content]');

        if (this.inPositionElementId != -1) {
            const targetItem = $(target).find('.container-item [data-id="' + this.inPositionElementId + '"]');
            const closestItemContent = $(targetItem).parent();
            $(closestItemContent).before(this.view);
        } else {
            $(target).append(this.view);
        }

        if (this.parentType == 'layout')
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId, this.parentContainerIndex);
        else
            this.model.appendObject(this.element, this.inPositionElementId, this.parentContainerId);

        this.regeneratePreview(this.element);
    }

    undo() {
        (new ActionRemoveElement(this.modelId, this.container, this.model, this.data)).do();
    }

    regeneratePreview(element) {
        const widget = ModelManager.getWidget(element.widget);
        widget.preview(element);
        if (widget.hasChildren(element.type)) {
            var elementsArray = element.type == 'layout' ? [].concat.apply([], element.data) : element.data;
            for (var i = 0; i < elementsArray.length; i++) {
                this.regeneratePreview(elementsArray[i]);
            }
        }
    }
}