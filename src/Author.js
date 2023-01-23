/* global $ */
/* global bootprompt */
import DragDropHandler from "./DragDropHandler";
import I18n from "./I18n";
import { Model } from "./model/Model";
import UndoRedo from "./undoredo";
import Utils from "./Utils";
import ModelManager from "./model/ModelManager";
import ActionAddElement from "./actions/ActionAddElement"
import ActionAddSection from "./actions/ActionAddSection"
import ActionRemoveElement from "./actions/ActionRemoveElement"
import ActionRemoveSection from "./actions/ActionRemoveSection"
import ActionSwapSections from "./actions/ActionSwapSections"
import widgetsJson from "./model/widgets/widgets.json"
import alertErrorTemplate from "./views/alertError.hbs";
import categoryTemplate from "./views/category.hbs"
import loadingTemplate from "./views/loading.hbs"
import settingsTemplate from "./views/modal-settings.hbs"
import previewGeneratedTemplate from "./views/preview-generated.hbs"
import "./styles/common-styles.scss";

export default class Author {

    constructor(palette, container) {
        this.version = "1.12.2";
        this.widgets = {};
        this.model = new Model({});
        this.undoredo = UndoRedo.getInstance();
        this.transform = {};
        this.strings = {};
        this.plugins = {};
        this.api = {};
        this.icons = {};
        this.dragDropHandler = new DragDropHandler(palette, container, this.model);
        this.i18n = I18n.getInstance();
        this.loadWidgets(palette);
        this.palette = palette;
        this.container = container;
        !$('#modal-loading').length && $(this.container).after(loadingTemplate());
        !$('#modal-settings').length && $(this.container).after(settingsTemplate());
        !$('#modal-preview-generated').length && $(this.container).after(previewGeneratedTemplate());
    }

    showLoading(title, message) {
        const $modal = $('#modal-loading');
        $modal.find('#modal-loading-title').html(title ?? this.i18n.value("common.loading.title"));
        $modal.find('#modal-loading-description').html(message ?? this.i18n.value("common.loading.description"));
        $modal.modal({ show: true, keyboard: false, backdrop: 'static'});
    }

    hideLoading() {
        $('#modal-loading').modal('hide');
    }

    /**
     * Retrieves a model element
     * @param {string} id - Model Element ID
     * @returns 
     */
    getModelElement(id) {
        return this.model.findObject(id);
    }

    /**
     * Removes all model sections
     */
    clearModelSections() {
        this.model.sections = [];
    }

    /**
     * Adds a new element to a container
     * @param {object} modelElement - Model Element data
     * @param {*} parentContainerId - ID of the container to add the element
     */
    addModelElement(modelElement, parentContainerId) {
        const action = new ActionAddElement(this.model, {
            element: modelElement,
            // Only important for columns, and we cannot add items in columns without dragging
            parentContainerIndex: -1,
            parentContainerId,
            // Add the element at the end of its container
            inPositionElementId: -1
        });
        this.undoredo.pushAndExecuteCommand(action);
    }

    /**
     * Duplicates a given model element
     * @param {object} element - Model Element data
     * @param {id} sectionId - Section ID
     */
    copyModelElement(element, sectionId) {
        this.addModelElement(this.model.copyElement(element), sectionId);
    }

    /**
     * Duplicates an existing section
     * @param {object} section - section data
     */
    copyModelSection(section) {
        this.addSection(this.model.copyElement(section));
    }

    /**
     * Adds a new empty section
     */
    addSection(modelSection) {
        const section = modelSection ?? ModelManager.getSection().emptyData(this.model.sections.length + 1);
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
    removeSection(sectionId) {
        const action = new ActionRemoveSection(this.model, {
            element: $.extend({}, this.model.findObject(sectionId)),
            position: Utils.findIndexObjectInArray(this.model.sections, "id", sectionId),
            container: this.container
        });
        this.undoredo.pushAndExecuteCommand(action);
        Utils.notifySuccess(this.i18n.translate("messages.deletedSection"));
    }

    /**
     * Moves a section up or down
     * @param {string} sectionOriginId - ID of the section to move
     * @param {number} direction 1 up, 0 down
     */
    swap(sectionOriginId, direction) {
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
    openSettings(dataElementId, type = "widget") {

        const self = this;
        // 0 Clear older values
        document.getElementById('modal-settings-body').innerHTML = ''; // clear the body
        $("#modal-settings .btn-submit").off('click'); // Unbind button submit click event 

        // 1  get model from object
        var modelObject = this.model.findObject(dataElementId);
        if (!modelObject) throw new Error('modelObject cannot be null');

        const modelElem = type === "widget" ? 
            ModelManager.getWidget(modelObject.widget) :
            ModelManager.getSection();

        // 2 Populate the modal with the inputs of the widget
        var modalContent = modelElem.getInputs(modelObject);
        // 3 Open the modal with values put
        document.getElementById('modal-settings-body').innerHTML = modalContent.inputs;
        document.getElementById('modal-settings-tittle').innerHTML = modalContent.title;
        $("#modal-settings").modal({ show: true, keyboard: false, focus: true, backdrop: 'static' });
        // 4 Associate functions to the modal
        var form = document.getElementById('f-' + dataElementId);
        var input = document.createElement('input');
        input.type = 'submit';
        input.classList.add('hide');
        form.appendChild(input);

        $(form).off('submit').on('submit', function (e) {
            e.preventDefault();
            var formData = Utils.toJSON(form);
            var errors = self.model.validateFormElement(modelElem, formData, dataElementId);
            if (errors.length > 0) {
                $("#modal-settings").animate({ scrollTop: 0 }, "slow");
                const errorText = errors.map(error => self.i18n.translate("errors." + error)).join(". ")
                if ($("#modal-settings-body .errors").length == 0) {
                    $("#modal-settings-body").prepend('<div class="errors">' + alertErrorTemplate({errorText}) + '</div>');
                } else {
                    $("#modal-settings-body .errors").html(alertErrorTemplate({errorText}));
                }

            } else {
                modelElem.settingsClosed(modelObject);
                $("#modal-settings").modal('hide');
                $("#modal-settings-body .errors").remove();
                modelElem.updateModelFromForm(modelObject, formData);
                const previewElement = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
                previewElement.innerHTML = modelElem.preview(modelObject);
                // Clear modal values
                document.getElementById('modal-settings-body').innerHTML = '';
                document.getElementById('modal-settings-tittle').innerHTML = '';
                // Clean errors
                previewElement && self.deleteToolTipError(previewElement);
                $(document.querySelector("[data-id='" + modelObject.id + "']").parentNode).removeClass('editor-error', 200);
                $(form).remove();
            }
        });

        $("#modal-settings .btn-submit").on('click', function () {
            input.click();
        });

        // 5 Run when settings are opened
        modelElem.settingsOpened(modelObject);
    }

    /**
     * Removes a given model element
     * @param {string} id - Model element ID
     */
    removeElement(id) {
        var elementToBeRemoved = this.model.findObject(id);
        var parent = this.model.findParentOfObject(id);
        var parentContainerId = parent.id;
        var parentContainerIndex = -1;
        var inPositionElementId = -1;
        let container;
        if (parent.type == 'layout') {
            parentContainerIndex = parent.data.findIndex(elemArr => elemArr.findIndex(elem => elem.id === id) !== -1);
            container = parent.data[parentContainerIndex];
        } else {
            container = parent.data;
        }

        const positionIndex = container.findIndex(elem => elem.id === id);
        if (positionIndex < container.length - 1)
            inPositionElementId = container[positionIndex + 1].id;

        const action = new ActionRemoveElement(this.model, {
            element: $.extend({}, elementToBeRemoved),
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
    addContent(containerId, widget) {
        const self = this;
        const widgetElem = ModelManager.getWidget(widget);
        const type = widgetElem.config.type;
        if (type != 'specific-container' && type != 'specific-element-container')
            throw new Error('Cannot create content for non-specific container');

        if (widgetElem.config.allow.length > 1) {
            const options = widgetElem.config.allow.map(allowed => ({
                text: this.i18n.translate(`widgets.${allowed}.label`),
                value: allowed
            }));
            bootprompt.prompt({
                title: this.i18n.translate("common.selectType"),
                inputType: 'select',
                inputOptions: options,
                value: widgetElem.config.allow[0], // Default option
                closeButton: false,
                callback: function (result) {
                    result && self.addSpecificContent(containerId, result);
                }
            });
        } else {
            self.addSpecificContent(containerId, widgetElem.config.allow[0]);
        }
    }

    /**
     * Creates a new child for the given container
     * @param {string} containerId - Container ID
     * @param {string} widgetTypeToCreate - Type of widget
     */
    addSpecificContent(containerId, widgetTypeToCreate) {
        this.addModelElement(this.model.createWidget(widgetTypeToCreate), containerId);
    }

    /**
     * Expands/Collapses a given category
     * @param {string} category - Category ID
     */
    toggleCategory(category) {
        var divCategory = document.querySelector("[data-category-header='" + category + "']");
        var icon = divCategory.querySelector("[data-icon]");
        var isHidden = divCategory.dataset.hidden === 'true';
        $(icon).toggleClass("fa-caret-down", !isHidden);
        $(icon).toggleClass("fa-caret-up", isHidden);
        $("[data-category=" + category + "]").toggle(isHidden);
        divCategory.dataset.hidden = !isHidden;
    }

    /**
     * Initializes the widgets palette with the elements contained in widgets.json
     * @param {HTMLElement} palette - Container for the widgets palette
     */
    loadWidgets(palette) {
        try {
            Object.entries(widgetsJson).forEach(entry => {
                const [category, widgets] = entry;
                const widgetsPalette = widgets
                    .filter(widget => !ModelManager.getWidget(widget).paletteHidden)
                    .map(widget => ModelManager.getWidget(widget).createPaletteItem());
                const categoryView = categoryTemplate({ title: "palette." + category, 
                    category: category, numWidgets: widgetsPalette.length});
                $(palette).append(categoryView);
                $(palette).append(widgetsPalette);
            });
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Shows the current model errors and hides de previous ones
     * @param {array} currentErrors - Previous model errors
     * @param {array} newErrors - Current model errors
     */
    showErrors(currentErrors, newErrors) {

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
                const preview = element.querySelector('[data-prev]');
                const title = error.keys
                    .map(key => this.i18n.translate("errors."+key))
                    .join(" ");
                $(element.parentNode).addClass('editor-error');
                this.creatToolTipError(title, preview);
            });
    }

    /**
     * Adds a tooltip with a descriptive validation error to the widget preview
     * @param {string} title - Error text 
     * @param {HTMLElement} previewElement - Textual preview of the widget element 
     */
    creatToolTipError(title, previewElement) {
        previewElement.dataset.title = title;
        previewElement.dataset['originalTitle'] = title;
        previewElement.addEventListener('mouseenter', $(previewElement).tooltip('show'));
        previewElement.addEventListener('mouseleave', $(previewElement).tooltip('hide'));
    }

    /**
     * Removes the tooltip validation errors from the widget preview
     * @param {HTMLElement} previewElement - Textual preview of the widget element
     */
    deleteToolTipError(previewElement) {
        delete previewElement.dataset.title;
        delete previewElement.dataset['originalTitle'];
        previewElement.removeEventListener('mouseenter', $(previewElement).tooltip('show'));
        previewElement.removeEventListener('mouseout', $(previewElement).tooltip('hide'));
        $(previewElement).tooltip('dispose');
    }

    /**
     * Validates the current editor model and shows errors associated with it
     * 
     * @param {boolean} print true if errors must be shown in the GUI, false if you only want to validate the content 
     * @returns true if valid, false if not valid
     */
    validateContent(print) {
        // Get previous errors
        var currentErrors = this.model.currentErrors;
        // Get new ones
        var newErrors = this.model.validate();
        // Paint errors in the view
        this.showErrors(currentErrors, newErrors);
        if (this.model.sections.length == 0) {
            if (print) Utils.notifyError(this.i18n.translate("messages.emptyContent"));
            return false;
        }
        if (newErrors.length > 0) {
            if (print) Utils.notifyError(this.i18n.translate("messages.contentErrors"));
            return false;
        }
        if (print) Utils.notifySuccess(this.i18n.translate("messages.noErrors"));
        return true;
    }

    /**
     * Loads a model instance into the current plugin instance and draws it in the main container
     * 
     * @param {*} model Model to be loaded in the plugin
     * @param {Function} onLoaded Function to run when the load has been successfully completed
     * @param {Function} onError Function to run hwen the load has not been successfully completeed
     */
    loadModelIntoPlugin(model) {
        this.model = new Model(model);
        this.dragDropHandler.setModel(this.model);
        this.model.sections.forEach(sectionData => {
            const sectionElement = ModelManager.getSection();
            const sectionHTML = sectionElement.createElement(sectionData);
            $(this.container).append(sectionHTML);        
        });
    }
}