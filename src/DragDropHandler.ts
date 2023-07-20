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
import Config from './Config';
import I18n from './I18n';

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
        if (target !== this.palette && !ModelManager.canHave(container, source))
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
            if (el.dataset.widget === "Bank") {
                this.openBankModal(el, target, sibling);
            }
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

    async onCreateElement(el: HTMLElement, target: HTMLElement, sibling: HTMLElement, widget?: ModelElement) {
        if (!widget) widget = await ModelManager.create(el.dataset.widget);
        //const widget = await ModelManager.create(el.dataset.widget); // Widget type (TextBlock, Image...etc)
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

    async openBankModal(el: HTMLElement, target: HTMLElement, sibling: HTMLElement) {
        $(el).hide();
        const { default: modalTemplate } = await import('./model/widgets/WidgetBank/modal.hbs');
        let data = await this.connectWithBank();
        data.map(elem => {
            elem["img"] = ModelManager.getWidgetElement(elem.type).icon
        });
        const groups = [...new Set(data.map(objeto => objeto.group))].filter(elem => elem != null);
        const types = [...new Set(data.map(objeto => objeto.type))];
        $("#modal-bank-widgets").remove();
        $(this.container).after(modalTemplate({ groups: groups, types: types, data: data }));
        $("#modal-bank-widgets").modal({ keyboard: false, focus: true, backdrop: 'static' });

        const aggregateWidget = async function (button: HTMLElement) {
            const json = $(button).find("input[name=content]").val() as string;
            const obj = JSON.parse(json);
            let widget = (await ModelManager.create(obj.widget, obj)).clone();
            const clonedElem = $(el).clone();
            $(clonedElem).insertBefore(el);
            this.onCreateElement(clonedElem.get(0), target, sibling, widget);

        }

        const onClick = aggregateWidget.bind(this);

        $("#check-select-all").on('change', function () {
            $(".d-flex .input-checkbox ").prop('checked', $("#check-select-all").prop('checked'));
        });

        $(".d-flex .input-checkbox").on("click", function () {
            $("#check-select-all").prop('checked', $(".d-flex .input-checkbox:checked").length === $(".d-flex .input-checkbox").length);
            $(this).prop("checked", !$(this).prop("checked"));
        });

        $(".widget-button").on("click", function () {
            const checkbox = $(this).find("input[type='checkbox']");
            checkbox.prop("checked", !checkbox.prop("checked"));
        });

        $("#modal-bank-widgets .btn-submit").on("click", async function (e) {
            if ($("#checkbox-random").prop("checked")) {
                const num = $("#number-of-random-widgets").val() as number;
                const total = $(".input-checkbox:checked").length;
                if (num > total) {
                    const { default: alertErrorTemplate } = await import("./views/alertError.hbs");
                    $("#modal-bank-widgets .errors").html(alertErrorTemplate({
                        errorText:
                            I18n.getInstance().translate('widgets.Bank.modal.maximumRandomWidgetsExceeded')
                    }));
                    e.preventDefault();
                    return;
                }

                const indexes = [];
                while (indexes.length < num) {
                    const indexAleatorio = Math.floor(Math.random() * total);
                    if (!indexes.includes(indexAleatorio)) {
                        indexes.push(indexAleatorio);
                        await onClick($(".input-checkbox:checked")[indexAleatorio].parentElement);
                    }
                }
            }
            else {
                $("#modal-bank-widgets .panel-bank-widgets input[type='checkbox']:checked").each((index, elem) => {
                    onClick(elem.parentElement);
                });
            }
            $("#modal-bank-widgets").modal('hide');
        });

        $('#modal-bank-widgets').on('hidden.bs.modal', function () {
            // Código para manejar el evento "dismiss" del modal
            $(target).find(el).remove();
        });

        $("#button-search-bank-widget").on('click', function () {

            const searchTerm = ($(" #modal-bank-widgets input[type='search']").val() as string).toLowerCase();
            const searchGroup = ($(" #modal-bank-widgets .select-group option:selected").val() as string).trim();
            const searchType = ($(" #modal-bank-widgets .select-type option:selected").val() as string).trim();

            $('.widget-button').each(function () {

                const result: boolean[] = [];

                const title = $(this).find('h3').text().toLowerCase();
                const group = $(this).find("input[name='group']").val() as string;
                const type = $(this).find("input[name='type']").val() as string;

                result[0] = title.includes(searchTerm);
                result[1] = searchGroup === "default" || group === searchGroup;
                result[2] = searchType === "default" || type === searchType;

                if (result.every(elem => elem)) {
                    $(this).removeClass("d-none").addClass("d-flex");
                } else {
                    $(this).removeClass("d-flex").addClass("d-none");
                }
            })
        })

    }

    async connectWithBank(): Promise<any> {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        const res = await fetch(Config.getBankOfWidgetsURL(), { method: 'GET', headers, redirect: 'follow' })
            .then(res => res.json())
            .then(res => {
                return res;
            });
        return res;
    }
}
