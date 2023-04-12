/* global $ */
import DragDropHandler from "./DragDropHandler";
import I18n from "./I18n";
import { Model } from "./model/Model";
import UndoRedo from "./Undoredo";
import Utils from "./Utils";
import ModelManager from "./model/ModelManager";
import ActionAddElement from "./actions/ActionAddElement"
import ActionAddSection from "./actions/ActionAddSection"
import ActionRemoveElement from "./actions/ActionRemoveElement"
import ActionRemoveSection from "./actions/ActionRemoveSection"
import ActionSwapSections from "./actions/ActionSwapSections"
import alertErrorTemplate from "./views/alertError.hbs";
import loadingTemplate from "./views/loading.hbs"
import settingsTemplate from "./views/modal-settings.hbs"
import previewGeneratedTemplate from "./views/preview-generated.hbs"
import "./styles/common-styles.scss";
import Category from "./category/Category";
import ModelElement from "./model/ModelElement";
import Section from "./model/section/Section";
import WidgetColumnsLayout from "./model/widgets/WidgetColumnsLayout/WidgetColumnsLayout";

export default class Author {

    private categories: Category[];
    private container: HTMLElement;
    private dragDropHandler: DragDropHandler;
    private i18n: I18n;
    private undoredo: UndoRedo;

    model: Model;

    static async create(palette: HTMLElement, container: HTMLElement): Promise<Author> {
        const result = new Author(palette, container);
        result.model = await Model.create({});
        result.dragDropHandler = new DragDropHandler(palette, container, result.model);
        return result;
    }

    constructor(palette: HTMLElement, container: HTMLElement) {
        this.undoredo = UndoRedo.getInstance();
        this.i18n = I18n.getInstance();
        this.categories = Object.entries(
            ModelManager.getAllWidgetsByCategory()).map(
                ([name, widgets]) => new Category(name, widgets));
        this.container = container;
        // Initialize the widgets palette
        $(palette).append(this.categories.map(cat => cat.render()).join(''));
        !$('#modal-loading').length && $(this.container).after(loadingTemplate());
        !$('#modal-settings').length && $(this.container).after(settingsTemplate());
        !$('#modal-preview-generated').length && $(this.container).after(previewGeneratedTemplate());
    }

    showLoading(title?: string, message?: string) {
        const $modal = $('#modal-loading');
        $modal.find('#modal-loading-title').html(title ?? this.i18n.value("common.loading.title"));
        $modal.find('#modal-loading-description').html(message ?? this.i18n.value("common.loading.description"));
        $modal.modal({ keyboard: false, backdrop: 'static' });
    }

    hideLoading() { $('#modal-loading').modal('hide'); }

    /**
     * Retrieves a model element
     * @param {string} id - Model Element ID
     * @returns 
     */
    getModelElement(id: string) { return this.model.findObject(id); }

    /**
     * Removes all model sections
     */
    clearModelSections() { this.model.sections = []; }

    /**
     * Adds a new element to a container
     * @param {ModelElement} modelElement - Model Element data
     * @param {string} parentContainerId - ID of the container to add the element
     */
    addModelElement(modelElement: ModelElement, parentContainerId: string): void {
        const action = new ActionAddElement(this.model, {
            element: modelElement,
            // Only important for columns, and we cannot add items in columns without dragging
            parentContainerIndex: -1,
            parentContainerId,
            // Add the element at the end of its container
            inPositionElementId: null
        });
        this.undoredo.pushAndExecuteCommand(action);
    }

    /**
     * Duplicates a given model element
     * @param {ModelElement} element - Model Element data
     * @param {string} sectionId - Section ID
     */
    copyModelElement(element: ModelElement, sectionId: string) {
        this.addModelElement(element.clone(), sectionId);
    }

    /**
     * Duplicates an existing section
     * @param {object} section - section data
     */
    copyModelSection(section: Section) {
        this.addSection(section.clone());
    }

    /**
     * Adds a new empty section
     */
    async addSection(modelSection?: Section) {
        const index = this.model.sections.length + 1;
        const section = modelSection ?? await ModelManager.create("Section", { index });
        const action = new ActionAddSection(this.model, {
            element: section,
            position: this.model.sections.length,
            container: this.container
        });
        this.undoredo.pushAndExecuteCommand(action);
    }

    /**
     * Removes a given section
     * @param {string} sectionId - Section ID
     */
    removeSection(sectionId: string) {
        const action = new ActionRemoveSection(this.model, {
            element: this.model.findObject(sectionId),
            position: Utils.findIndexObjectInArray(this.model.sections, "id", sectionId),
            container: this.container
        });
        this.undoredo.pushAndExecuteCommand(action);
        Utils.notifySuccess(this.i18n.value("messages.deletedSection"));
    }

    /**
     * Moves a section up or down
     * @param {string} sectionOriginId - ID of the section to move
     * @param {number} direction 1 up, 0 down
     */
    swap(sectionOriginId: string, direction: number) {
        const action = new ActionSwapSections(this.model, {
            sectionOriginId: sectionOriginId,
            direction: direction
        });
        this.undoredo.pushAndExecuteCommand(action);
    }

    /**
     * Opens a new modal window to edit a given model element
     * @param {string} dataElementId - ModelElement ID
     * @param {widget|section} type - type of element: section or widget
     */
    openSettings(dataElementId: string) {

        const self = this;
        // 0 Clear older values
        $('#modal-settings-body').empty(); // clear the body
        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 

        // 1  get model from object
        const modelElem = this.model.findObject(dataElementId);
        if (!modelElem) throw new Error('Could not locate the given element id');

        // 2 Populate the modal with the inputs of the widget
        modelElem.getInputs().then(modalContent => {
            // 3 Open the modal with values put
            $('#modal-settings-body').html(modalContent.inputs);
            $('#modal-settings-tittle').html(modalContent.title);
            $("#modal-settings").modal({ keyboard: false, focus: true, backdrop: 'static' });
            // 4 Associate functions to the modal
            const $form = $("#f-" + dataElementId);
            $form.append("<input type='submit' class='hide' />");
            $("#modal-settings-body").prepend('<div class="errors"></div>');

            $form.off('submit').on('submit', function (e) {
                e.preventDefault();
                const formData = Utils.toJSON(this);
                const errors = self.model.validateFormElement(modelElem, formData);
                if (errors.length > 0) {
                    $("#modal-settings").animate({ scrollTop: 0 }, "slow");
                    const errorText = errors.map(error => self.i18n.translate("errors." + error)).join(". ")
                    $("#modal-settings-body .errors").html(alertErrorTemplate({ errorText }));
                    return;
                }

                modelElem.settingsClosed();
                $("#modal-settings").modal('hide');
                modelElem.updateModelFromForm(formData);
                const modelTemplate = document.querySelector('[data-id="' + modelElem.id + '"]');
                if (modelTemplate) {
                    modelTemplate.parentNode && $(modelTemplate.parentNode).removeClass('editor-error');
                    const previewElement = modelTemplate.querySelector('[data-prev]');
                    if (previewElement) {
                        previewElement.innerHTML = modelElem.preview();
                        // Clean errors
                        self.deleteToolTipError(<HTMLElement>previewElement);
                    }
                }
            });

            $("#modal-settings .btn-submit").on('click', function () {
                $form.find('input[type="submit"]').trigger('click');
            });

            // 5 Run when settings are opened
            modelElem.settingsOpened();
        });
    }

    /**
     * Removes a given model element
     * @param {string} id - Model element ID
     */
    removeElement(id: string) {
        var elementToBeRemoved = this.model.findObject(id);
        var parent = this.model.findParentOfObject(id);
        var parentContainerId = parent.id;
        var parentContainerIndex = -1;
        var inPositionElementId = null;
        let container: any[];
        if (parent instanceof WidgetColumnsLayout) {
            parentContainerIndex = (<WidgetColumnsLayout>parent)
                .data.findIndex(elemArr => elemArr.findIndex(elem => elem.id === id) !== -1);
            container = parent.data[parentContainerIndex];
        } else {
            container = parent.data;
        }

        const positionIndex = container.findIndex(elem => elem.id === id);
        if (positionIndex < container.length - 1)
            inPositionElementId = container[positionIndex + 1].id;

        const action = new ActionRemoveElement(this.model, {
            element: elementToBeRemoved,
            parentContainerIndex,
            parentContainerId,
            inPositionElementId
        });
        this.undoredo.pushAndExecuteCommand(action);
    }

    /**
     * Creates a given widget in a specified container
     * @param {string} containerId - Container ID
     * @param {string} widget - Type of widget
     */
    addContent(containerId: string, widget: string) {
        const self = this;
        const allowed = ModelManager.allowed(widget);
        if (allowed.length === 0)
            throw new Error('Cannot create content for non-specific container');

        if (allowed.length === 1) {
            self.addSpecificContent(containerId, allowed[0].widget);
            return;
        }

        const options = allowed.map(proto => ({
            text: this.i18n.value(`widgets.${proto.widget}.label`),
            value: proto.widget
        }));

        import('bootprompt').then(bootprompt => {
            bootprompt.prompt({
                title: this.i18n.value("common.selectType"),
                inputType: 'select',
                inputOptions: options,
                value: allowed[0].widget, // Default option
                closeButton: false,
                callback: function (result) {
                    result && self.addSpecificContent(containerId, result);
                }
            });
        });

    }

    /**
     * Creates a new child for the given container
     * @param {string} containerId - Container ID
     * @param {string} type - Type of widget
     */
    async addSpecificContent(containerId: string, type: string) {
        this.addModelElement(await ModelManager.create(type), containerId);
    }

    /**
     * Expands/Collapses a given category
     * @param {string} category - Category ID
     */
    toggleCategory(category: string) {
        const cat = this.categories.find(cat => cat.name === category);
        cat && cat.toggle();
    }

    /**
     * Shows the current model errors and hides de previous ones
     * @param {array} currentErrors - Previous model errors
     * @param {array} newErrors - Current model errors
     */
    showErrors(currentErrors: { element: string, keys: string[] }[], newErrors: { element: string, keys: string[] }[]) {

        // Remove previous errors
        currentErrors
            .map(error => document.querySelector("[data-id='" + error.element + "']"))
            .filter(elem => elem !== null)
            .forEach(elem => {
                this.deleteToolTipError(elem.querySelector('[data-prev]'));
                $(elem.parentNode).removeClass('editor-error');
            });

        // Show new errors
        newErrors
            .forEach(error => {
                const element = document.querySelector("[data-id='" + error.element + "']");
                if (element) {
                    element.parentNode && $(element.parentNode).addClass('editor-error');
                    const preview = <HTMLElement>element.querySelector('[data-prev]');
                    if (preview) {
                        const title = error.keys
                            .map(key => this.i18n.value("errors." + key))
                            .join(" ");
                        this.creatToolTipError(title, preview);
                    }
                }
            });
    }

    /**
     * Adds a tooltip with a descriptive validation error to the widget preview
     * @param {string} title - Error text 
     * @param {HTMLElement} previewElement - Textual preview of the widget element 
     */
    creatToolTipError(title: string, previewElement: HTMLElement) {
        previewElement.dataset.title = title;
        previewElement.dataset['originalTitle'] = title;
        previewElement.addEventListener('mouseenter', () => $(previewElement).tooltip('show'));
        previewElement.addEventListener('mouseleave', () => $(previewElement).tooltip('hide'));
    }

    /**
     * Removes the tooltip validation errors from the widget preview
     * @param {HTMLElement} previewElement - Textual preview of the widget element
     */
    deleteToolTipError(previewElement: HTMLElement) {
        delete previewElement.dataset.title;
        delete previewElement.dataset['originalTitle'];
        previewElement.removeEventListener('mouseenter', () => $(previewElement).tooltip('show'));
        previewElement.removeEventListener('mouseout', () => $(previewElement).tooltip('hide'));
        $(previewElement).tooltip('dispose');
    }

    /**
     * Validates the current editor model and shows errors associated with it
     * 
     * @param {boolean} print true if errors must be shown in the GUI, false if you only want to validate the content 
     * @returns true if valid, false if not valid
     */
    validateContent(print: boolean) {
        // Get previous errors
        var currentErrors = this.model.currentErrors;
        // Get new ones
        var newErrors = this.model.validate();
        // Paint errors in the view
        this.showErrors(currentErrors, newErrors);
        if (this.model.sections.length == 0) {
            if (print) Utils.notifyError(this.i18n.value("messages.emptyContent"));
            return false;
        }
        if (newErrors.length > 0) {
            if (print) Utils.notifyError(this.i18n.value("messages.contentErrors"));
            return false;
        }
        if (print) Utils.notifySuccess(this.i18n.value("messages.noErrors"));
        return true;
    }

    /**
     * Loads a model instance into the current plugin instance and draws it in the main container
     * 
     * @param {*} model Model to be loaded in the plugin
     */
    async loadModelIntoPlugin(model: any) {
        this.model = await Model.create(model);
        this.dragDropHandler.setModel(this.model);
        $(this.container).append(this.model.sections.map(section => section.createElement()).join(''));
    }

    async resetModel() {
        this.model = await Model.create({});
    }
}