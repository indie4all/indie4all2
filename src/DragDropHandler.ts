/* global $ */
import dragula, { Drake } from 'dragula';
import Utils from "./Utils";
import ModelManager from "./model/ModelManager";
import ActionMoveElement from './actions/ActionMoveElement';
import ActionMoveContainer from './actions/ActionMoveContainer';
import UndoRedo from './Undoredo';
import ActionAddElement from './actions/ActionAddElement';
import { Model } from './model/Model';
import WidgetColumnsLayout from './model/widgets/WidgetColumnsLayout/WidgetColumnsLayout';
import WidgetContainerElement from './model/widgets/WidgetContainerElement/WidgetContainerElement';
import Section from './model/section/Section';
import ModelElement from './model/ModelElement';

export default class DragDropHandler {
    private palette: HTMLElement;
    private container: HTMLElement;
    private model: Model;
    private undoredo: UndoRedo;
    private drake: Drake;

    constructor(palette: HTMLElement, container: HTMLElement, model: Model) {
        this.palette = palette;
        this.container = container;
        this.model = model;
        this.undoredo = UndoRedo.getInstance();
        this.drake = dragula({
            isContainer: (el) => el?.classList.contains('dragula-container') ?? false,
            copy: (_, source) => (source == palette),
            accepts: (el, target) => this.accept(<HTMLElement>el, <HTMLElement>target),
            moves: (el, _, handle) => (handle?.classList.contains('drag-item') || el?.classList.contains('palette-item')) ?? false,
            invalid: (el) => el?.classList.contains('dragula-anchor') ?? false,
            removeOnSpill: false
        });

        // Event associated with the drop of the element inside a DOM Container
        this.drake.on('drop', (el, target, source, sibling) => this.drop(el as HTMLElement, target as HTMLElement,
            source as HTMLElement, sibling as HTMLElement));

    }

    allowGenerate(source: HTMLElement, target: HTMLElement) {
        const targetElement = ModelManager.get(target.dataset.widget);
        return source == this.palette && (targetElement instanceof Section || this.container.contains(target));
        return (source == this.palette && (target.dataset.type == 'section-container' || Utils.contains(this.container, target)));
    }

    accept(element: HTMLElement, target: HTMLElement) {
        // Depending if the element comes from the palette or from the main container, the info will be inside the element's first child or the element itself
        const originElement = element.classList.contains('palette-item') ? element : element.querySelector('div');
        if (!originElement) return false;

        // Extract the info
        const source: any = ModelManager.get(originElement.dataset.widget);
        const container: any = ModelManager.get(target.dataset.widget);

        // We ask the widgets if the target is not the palette
        if (target !== this.palette && !(<typeof ModelElement>container).canHave(source))
            return false;

        /* We must not accept the movement if
            -- The target container is inside the palette
            -- If the target container is, in fact, the palette 
            -- If the target container is the element itself  
        */
        return !this.palette.contains(target) && !element.contains(target);
    }

    drop(el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement) {
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

    setModel(model: Model) {
        this.model = model;
    }

    onMoveElement(el: HTMLElement, target: HTMLElement) {

        const origin = $(el).children('div')[0];
        const elementId = origin.dataset.id;
        const element = this.model.findObject(elementId);
        const newPosition = [].findIndex.call(target.children,
            (ch: HTMLElement) => origin.dataset.id === $(ch).children('div').get(0).dataset.id);
        const containerId = $(target).closest('[data-id]')[0].dataset.id;
        const parentContainer = this.model.findObject(containerId);

        let containerIndex = -1, initialPosition: number;
        if (parentContainer instanceof WidgetColumnsLayout) {
            containerIndex = parseInt(target.dataset.index);
            initialPosition = parentContainer.data[containerIndex].findIndex(elem => elem.id == elementId);
        } else if (parentContainer instanceof WidgetContainerElement || parentContainer instanceof Section) {
            initialPosition = parentContainer.data.findIndex(elem => elem.id == elementId);
        }
        const action = new ActionMoveElement(this.model, {
            containerId, containerIndex, initialPosition, finalPosition: newPosition, element
        });
        this.undoredo.pushCommand(action);
        this.model.moveElementWithinContainer(elementId, newPosition, containerId, containerIndex == -1 ? null : containerIndex);
    }

    onMoveElementIntoContainer(el: HTMLElement, target: HTMLElement, sibling: HTMLElement) {
        // Get the source container and source element position
        const origin = $(el).children('div')[0];
        const elementId = origin.dataset.id;
        const element = this.model.findObject(elementId);
        const sourceParent = this.model.findParentOfObject(elementId);
        const targetParentId = $(target).closest('[data-id]')[0].dataset.id;
        const targetParent = this.model.findObject(targetParentId);
        const inPositionElementId = sibling ? $(sibling).children('div')[0].dataset.id : null;
        let sourceContainerIndex = -1, targetContainerIndex = -1;
        let sourcePosition: number, targetPosition: number;

        if (sourceParent instanceof WidgetColumnsLayout) {
            for (let i = 0; i < sourceParent.data.length; i++) {
                const sourceelementIndex = sourceParent.data[i].findIndex(elem => elem.id == elementId);
                if (sourceelementIndex !== -1) {
                    sourcePosition = sourceelementIndex;
                    sourceContainerIndex = i;
                }
            }
        } else if (sourceParent instanceof WidgetContainerElement || sourceParent instanceof Section) {
            sourcePosition = sourceParent.data.findIndex(elem => elem.id == elementId);
        }

        // Get target
        if (targetParent instanceof WidgetColumnsLayout) {
            targetContainerIndex = parseInt(target.dataset.index);
            targetPosition = targetParent.data[targetContainerIndex].findIndex(elem => elem.id == inPositionElementId);
        } else if (targetParent instanceof WidgetContainerElement || targetParent instanceof Section) {
            targetPosition = targetParent.data.findIndex(elem => elem.id == inPositionElementId);
        }

        // For command
        this.undoredo.pushCommand(new ActionMoveContainer(this.model, {
            source: {
                id: sourceParent.id,
                position: sourcePosition,
                index: sourceContainerIndex
            },
            target: {
                id: targetParentId,
                position: targetPosition,
                index: targetContainerIndex
            },
            element
        }));

        // Move
        this.model.moveElementFromContainerToAnother(elementId, inPositionElementId, targetParentId, targetContainerIndex);
    }

    onCreateElement(el: HTMLElement, target: HTMLElement, sibling: HTMLElement) {
        const widget = ModelManager.create(el.dataset.widget); // Widget type (TextBlock, Image...etc)
        const parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
        const inPositionElementId = sibling ? $(sibling).children('div').first().data('id') : null;
        let parentContainerIndex = -1; // Parent container index (only for layout)
        const parent = this.model.findObject(parentContainerId);
        const elementToBeAppended = widget.createElement();
        $(el).replaceWith(elementToBeAppended);
        if (parent instanceof WidgetColumnsLayout)
            parentContainerIndex = parseInt(target.dataset.index);
        this.model.appendObject(widget, inPositionElementId, parentContainerId, parentContainerIndex);
        this.undoredo.pushCommand(new ActionAddElement(this.model, {
            element: widget,
            parentContainerIndex, parentContainerId, inPositionElementId
        }));
    }
}
