import { inject } from "inversify";
import { Model } from "../../elements/model";
import UndoRedoService from "../undoredo/undoredo.service";
import dragula, { Drake } from 'dragula';
import ContainerManager from "../../../container.manager";
import SectionElement from "../../elements/section/section.element";
import BankElement from "../../elements/bank/bank.element";
import Element from "../../elements/element/element";
import UtilsService from "../utils/utils.service";
import MoveContainerAction from "../undoredo/actions/move-container.action";
import ColumnsLayoutElement from "../../elements/columns-layout/columns-layout.element";
import ContainerElement from "../../elements/container/container.element";
import AddElementAction from "../undoredo/actions/add-element.action";
import MoveElementAction from "../undoredo/actions/move-element.action";
import MigratorService from "../migrator/migrator.service";
import Action from "../undoredo/actions/action";

export default class DragDropService {
    private palette: HTMLElement;
    private container: HTMLElement;
    private _model: Model;
    private drake: Drake;
    private injector = ContainerManager.instance;

    @inject("Factory<Element>")
    private factory: (widget: string, values?: any, options?: any) => Promise<Element>;

    @inject('Factory<Action>')
    protected _actionFactory: <T extends Action>(typeAction: new () => T, model: Model, data: any) => Promise<T>;

    constructor(
        @inject(UndoRedoService) private undoredo: UndoRedoService,
        @inject(UtilsService) private utils: UtilsService,
        @inject(MigratorService) private migrator: MigratorService
    ) { }

    public async init(palette: HTMLElement, container: HTMLElement, model: Model) {
        this.palette = palette;
        this.container = container;
        this.model = model;
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
        const targetElement = this.injector.getElement(target.dataset.widget);
        return source == this.palette && (targetElement instanceof SectionElement || this.container.contains(target));
    }

    accept(element: HTMLElement, target: HTMLElement) {
        // Depending if the element comes from the palette or from the main container, the info will be inside the element's first child or the element itself
        const originElement = element.classList.contains('palette-item') ? element : element.querySelector('div');
        if (!originElement) return false;

        /* We must not accept the movement if
            -- The target container is inside the palette
            -- If the target container is, in fact, the palette 
            -- If the target container is the element itself  
        */
        if (target === this.palette || this.palette.contains(target) || element.contains(target)) return false;
        // Extract the info
        const source: any = this.injector.getElement(originElement.dataset.widget);
        const container: any = this.injector.getElement(target.dataset.widget);
        return this.injector.canHave(container, source);
    }

    drop(el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement) {
        if (!target) return;
        if (this.allowGenerate(source, target)) {
            if (el.dataset.widget === "Bank") this.createWidgetsFromBank(el, target, sibling);
            // Add a new element to the container
            else this.onCreateElement(el, target, sibling);
        } else if (source != target) {
            // Move one element from a container to another
            this.onMoveElementIntoContainer(el, target, sibling);
        } else if (source == target) {
            // Move the element inside the same container
            this.onMoveElement(el, target);
        }
    }

    async createWidgetsFromBank(el: HTMLElement, target: HTMLElement, sibling: HTMLElement) {
        el.classList.add('d-none');
        const bank = await this.factory(BankElement.widget) as BankElement;
        bank.edit(async (formData) => {
            el.classList.remove('d-none');
            let elems = formData.widget.filter(elem => elem.checked);
            if (formData.random) elems = elems.sort(() => Math.random() - 0.5).slice(0, formData['random-number']);
            await Promise.all(elems.map(async elem => {
                const updated = await this.migrator.migrateWidget(JSON.parse(elem.content));
                const widget = await this.factory(elem.type, updated, { regenerateId: true });
                const clonedElem = el.cloneNode(true) as HTMLElement;
                el.insertAdjacentElement('beforebegin', clonedElem);
                this.onCreateElement(clonedElem, target, sibling, widget);
            }));
            el.remove();
        });
    }

    set model(model: Model) { this._model = model; }

    async onMoveElement(el: HTMLElement, target: HTMLElement) {

        const origin = $(el).children('div')[0];
        const elementId = origin.dataset.id;
        const element = this._model.findObject(elementId);
        const newPosition = [].findIndex.call(target.children,
            (ch: HTMLElement) => origin.dataset.id === $(ch).children('div').get(0).dataset.id);
        const containerId = $(target).closest('[data-id]')[0].dataset.id;
        const parentContainer = this._model.findObject(containerId);

        let containerIndex = -1, initialPosition: number;
        if (parentContainer instanceof ColumnsLayoutElement) {
            containerIndex = parseInt(target.dataset.index);
            initialPosition = parentContainer.data[containerIndex].findIndex(elem => elem.id == elementId);
        } else if (parentContainer instanceof ContainerElement || parentContainer instanceof SectionElement) {
            initialPosition = parentContainer.data.findIndex(elem => elem.id == elementId);
        }
        const action = this._actionFactory(MoveElementAction, this._model, {
            containerId, containerIndex, initialPosition, finalPosition: newPosition, element
        });
        this.undoredo.pushCommand(action);
        this._model.moveElementWithinContainer(elementId, newPosition, containerId, containerIndex == -1 ? null : containerIndex);
    }

    async onMoveElementIntoContainer(el: HTMLElement, target: HTMLElement, sibling: HTMLElement) {
        // Get the source container and source element position
        const origin = $(el).children('div')[0];
        const elementId = origin.dataset.id;
        const element = this._model.findObject(elementId);
        const sourceParent = this._model.findParentOfObject(elementId);
        const targetParentId = $(target).closest('[data-id]')[0].dataset.id;
        const targetParent = this._model.findObject(targetParentId);
        const inPositionElementId = sibling ? $(sibling).children('div')[0].dataset.id : null;
        let sourceContainerIndex = -1, targetContainerIndex = -1;
        let sourcePosition: number, targetPosition: number;

        if (sourceParent instanceof ColumnsLayoutElement) {
            for (let i = 0; i < sourceParent.data.length; i++) {
                const sourceelementIndex = sourceParent.data[i].findIndex(elem => elem.id == elementId);
                if (sourceelementIndex !== -1) {
                    sourcePosition = sourceelementIndex;
                    sourceContainerIndex = i;
                }
            }
        } else if (sourceParent instanceof ContainerElement || sourceParent instanceof SectionElement) {
            sourcePosition = sourceParent.data.findIndex(elem => elem.id == elementId);
        }

        // Get target
        if (targetParent instanceof ColumnsLayoutElement) {
            targetContainerIndex = parseInt(target.dataset.index);
            targetPosition = targetParent.data[targetContainerIndex].findIndex(elem => elem.id == inPositionElementId);
        } else if (targetParent instanceof ContainerElement || targetParent instanceof SectionElement) {
            targetPosition = targetParent.data.findIndex(elem => elem.id == inPositionElementId);
        }

        const action = this._actionFactory(MoveContainerAction, this._model, {
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
        });

        // For command
        this.undoredo.pushCommand(action);

        // Move
        this._model.moveElementFromContainerToAnother(elementId, inPositionElementId, targetParentId, targetContainerIndex);
    }

    async onCreateElement(el: HTMLElement, target: HTMLElement, sibling: HTMLElement, widget?: Element) {
        if (!widget) widget = await this.factory(el.dataset.widget);
        const parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
        const inPositionElementId = sibling ? $(sibling).children('div').first().data('id') : null;
        let parentContainerIndex = -1; // Parent container index (only for layout)
        const parent = this._model.findObject(parentContainerId);
        const elementToBeAppended = widget.createElement();
        $(el).replaceWith(elementToBeAppended);
        if (parent instanceof ColumnsLayoutElement)
            parentContainerIndex = parseInt(target.dataset.index);
        this._model.appendObject(widget, inPositionElementId, parentContainerId, parentContainerIndex);
        const action = this._actionFactory(AddElementAction, this._model, {
            element: widget,
            parentContainerIndex, parentContainerId, inPositionElementId
        });
        this.undoredo.pushCommand(action);
    }
}
