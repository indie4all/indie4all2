/* global $ */
import dragula from 'dragula';
import Utils from "./Utils";
import ModelManager from "./model/ModelManager";
import ActionMoveElement from './actions/ActionMoveElement';
import ActionMoveContainer from './actions/ActionMoveContainer';
import UndoRedo from './undoredo';
import ActionAddElement from './actions/ActionAddElement';

export default class DragDropHandler {

    constructor(palette, container, model) {
        this.palette = palette;
        this.container = container;
        this.model = model;
        this.undoredo = UndoRedo.getInstance();
        this.drake = dragula([], {
            isContainer: (el) => $(el).hasClass('dragula-container'),
            copy: (el, source) => (source == palette),
            accepts: (el, target) => this.accept(el, target),
            moves: (el, subContainer, handle) => $(handle).hasClass('drag-item') || $(el).hasClass('palette-item'),
            invalid: (el) => $(el).hasClass('dragula-anchor'),
            removeOnSpill: false
        });

        // Event associated with the drop of the element inside a DOM Container
        this.drake.on('drop', (el, target, source, sibling) => this.drop(el, target, source, sibling));

    }

    allowGenerate(source, target) {
        return (source == this.palette && (target.dataset.type == 'section-container' || Utils.contains(this.container, target)));
    }

    accept(element, target) {
        // Depending if the element comes from the palette or from the main container, the info will be inside the element's first child or the element itself
        var originElement = $(element).hasClass('palette-item') ? element : $(element).children('.widget')[0];

        // Extract the info
        var itemType = originElement.dataset.type;
        var itemWidget = originElement.dataset.widget;
        var targetType = target.dataset.type;
        var targetWidget =  target.dataset.widget;

        // We ask the widgets if the target is not the palette
        if (target != this.palette && (!this.canDrop(itemType, itemWidget, targetType, targetWidget)))
            return false;

        /* We must not accept the movement if
            -- The target container is inside the palette
            -- If the target container is, in fact, the palette 
            -- If the target container is the element itself  
        */
        return (!Utils.contains(this.palette, target) && (target !== this.palette) && !Utils.contains(element, target));
    }

    canDrop(itemType, itemWidget, targetType, targetWidget) {
        // 0 - If the item has the same type as the target, the item won't be dropped   
        if (itemType == targetType)
            return false;

        // 1 - If the item is an element-container it can not be dropped in the main container. 
        if (targetType == 'section-container' && (itemType != 'element-container' && itemType != 'specific-element'))
            return true;

        // 2 - Specific cases
        if (targetType == 'specific-container' || targetType == 'specific-element-container') {
            // 2.1 - specific containers has inside the allow configuration value the widget  
            var containersAllowed = ModelManager.getWidget(targetWidget).config.allow;
            return (Utils.stringIsInArray(itemWidget, containersAllowed));
        } else if (targetType == 'element-container' || targetType == 'layout' || targetType == 'simple-container') {
            // 2.2 - layout or element containers has inside the allow configuration value the types of elements that can be placed inside
            var typesAllowed = ModelManager.getWidget(targetWidget).config.allow;
            return (Utils.stringIsInArray(itemType, typesAllowed));
        }
    }


    drop(el, target, source, sibling) {
        if (!target) return;
        if (this.allowGenerate(source, target)) {
            // Add a new element to the container
            this.onCreateElement(el, target, sibling);
        } else if (source != target) {
            // Move one element from a container to another
            this.onMoveElementIntoContainer(el, target, sibling);
        } else if (source == target) {
            // Move the element inside the same container
            this.onMoveElement(el, target);
        }
    }

    setModel(model) {
        this.model = model;
    }

    onMoveElement(el, target) {

        const origin = $(el).children('.widget')[0];
        var elementId = origin.dataset.id;
        var containerType = target.dataset.type;
        // New order of the elements inside the target
        var targetChildren = [].slice.call(target.children).map(function (ch) {
            return $(ch).children('.widget')[0].dataset.id;
        });

        var newPosition = targetChildren.indexOf(origin.dataset.id, 0);

        let containerId, containerIndex, parentContainer, initialPosition;
        if (containerType == 'layout') {
            containerId = target.parentNode.parentNode.parentNode.dataset.id; // 3 nesting levels 
            containerIndex = target.dataset.index;
            parentContainer = this.model.findObject(containerId);
            initialPosition = Utils.findIndexObjectInArray(parentContainer.data[containerIndex], 'id', elementId);
            this.undoredo.pushCommand(new ActionMoveElement(elementId, this.container, this.model, {
                containerType: containerType,
                containerIndex: containerIndex,
                containerId: containerId,
                initialPosition: initialPosition,
                finalPosition: newPosition
            }));

            this.model.moveElementWithinContainer(elementId, newPosition, containerId, containerIndex);
        } else {
            containerId = target.parentNode.dataset.id;
            parentContainer = this.model.findObject(containerId);
            initialPosition = Utils.findIndexObjectInArray(parentContainer.data, 'id', elementId);
            this.undoredo.pushCommand(new ActionMoveElement(elementId, this.container, this.model, {
                containerType: containerType,
                containerIndex: -1,
                containerId: containerId,
                initialPosition: initialPosition,
                finalPosition: newPosition
            }));
            this.model.moveElementWithinContainer(elementId, newPosition, containerId);
        }
    }

    onMoveElementIntoContainer(el, target, sibling) {
        // Get the source container and source element position
        const origin = $(el).children('.widget')[0];
        var elementId = origin.dataset.id;
        var element = this.model.findObject(elementId);
        var parentElement = this.model.findParentOfObject(elementId);
        var sourceContainerIndex = -1;
        var sourcePosition;

        if (parentElement.type == 'layout') {
            for (var i = 0; i < parentElement.data.length; i++) {
                var sourceelementIndex = Utils.findIndexObjectInArray(parentElement.data[i], 'id', elementId);
                if (sourceelementIndex != -1) {
                    sourcePosition = sourceelementIndex;
                    sourceContainerIndex = i;
                }
            }
        } else {
            sourcePosition = Utils.findIndexObjectInArray(parentElement.data, 'id', elementId);
        }

        // Get target
        var inPositionElementId = sibling != null ? $(sibling).children('.widget')[0].dataset.id : -1;
        var containerType = target.dataset.type;
        var containerId;
        var containerIndex = -1;
        var containerPosition;
        let targetContainer;
        if (containerType == 'layout') {
            containerId = target.parentNode.parentNode.parentNode.dataset.id;
            containerIndex = target.dataset.index;
            targetContainer = this.model.findObject(containerId);
            containerPosition = Utils.findIndexObjectInArray(targetContainer.data[containerIndex], 'id', inPositionElementId);
        } else {
            containerId = target.parentNode.dataset.id;
            targetContainer = this.model.findObject(containerId);
            containerPosition = Utils.findIndexObjectInArray(targetContainer.data, 'id', inPositionElementId);
        }

        // For command
        
        this.undoredo.pushCommand(new ActionMoveContainer(elementId, this.container, this.model, {
            source: {
                id: parentElement.id,
                type: parentElement.type,
                position: sourcePosition,
                index: sourceContainerIndex
            },
            target: {
                id: containerId,
                type: containerType,
                position: containerPosition,
                index: containerIndex
            },
            element: $.extend({}, element)
        }));

        // Move
        this.model.moveElementFromContainerToAnother(elementId, inPositionElementId, containerId, containerIndex);
    }

    onCreateElement(el, target, sibling) {
        var widget = el.dataset.widget; // Widget type (TextBlock, Image...etc)
        var parentType = target.dataset.type; // Parent type
        var parentContainerIndex = -1; // Parent container index (only for layout)
        if (parentType == 'layout') parentContainerIndex = target.dataset.index;
        var parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
        var dataElementId = Utils.generate_uuid();
        var inPositionElementId = sibling != null ? $(sibling).children('.widget').first().data('id') : -1;
        const elementToBeAppended = ModelManager.getWidget(widget).createElement({ id: dataElementId });
        $(el).replaceWith(elementToBeAppended);
        const modelObject = this.model.createWidget(widget, dataElementId);
        this.model.appendObject(modelObject, inPositionElementId, parentContainerId, parentContainerIndex);
        this.undoredo.pushCommand(new ActionAddElement(dataElementId, this.container, this.model, {
            element: $.extend({}, this.model.findObject(dataElementId)),
            parentType: parentType,
            parentContainerIndex: parentContainerIndex,
            parentContainerId: parentContainerId,
            inPositionElementId: inPositionElementId
        }));
    }
}
