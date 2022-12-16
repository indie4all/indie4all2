/* global $ */
import dragula from 'dragula';
import Utils from "./Utils";
import ModelManager from "./model/ModelManager";

export default class DragDropHandler {

    constructor(palette, container, onMoveElement, onMoveElementIntoContainer, onCreateElement) {
        this.palette = palette;
        this.container = container;
        this.onMoveElement = onMoveElement;
        this.onMoveElementIntoContainer = onMoveElementIntoContainer;
        this.onCreateElement = onCreateElement;
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
        var originElement = $(element).hasClass('palette-item') ? element : element.firstChild;

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
}
