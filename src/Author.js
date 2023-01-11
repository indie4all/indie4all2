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
    }

    showLoading() {
        const $modal = $('#modal-loading');
        $modal.modal({ show: true, keyboard: false, backdrop: 'static'});
    }

    hideLoading() {
        $('#modal-loading').modal('hide');
    }

    getModelElement(id) {
        return this.model.findObject(id);
    }

    clearModelSections() {
        this.model.sections = [];
    }

    copyModelElement(element, sectionId, isCommand) {
        const position = Utils.findIndexObjectInArray(this.model.sections, "id", sectionId);
        const section = this.model.sections[position];
        let copy = this.model.copyElement(element);
        let container = document.getElementById('section-elements-' + section.id);
        this.loadElement(container, copy);
        section.data.push(copy);
        if (isCommand) {
            const action = new ActionAddElement(copy.id, this.container, this.model, {
                element: copy,
                parentType: 'section-container',
                parentContainerIndex: this.model.sections.indexOf(section),
                parentContainerId: section.id,
                inPositionElementId: -1 // Change
            });
            this.undoredo.pushCommand(action);
        }
    }

    copyModelSection = function (section, isCommand) {
        let copy = this.model.copyElement(section);
        this.model.sections.push(copy);
        this.loadElement(this.container, copy);
        if (isCommand) {
            this.undoredo.pushCommand(new ActionAddSection(copy.id, this.container, this.model, {
                element: copy,
                parentType: "section-container",
                position: (this.model.sections.length - 1)
            }));
        }
    }

    addSection(sectionId, isCommand) {
        const section = sectionId ? this.model.findObject(sectionId) : this.model.createSection();
        const rendered = ModelManager.getSection().createElement(section);
        $(this.container).append(rendered);
        if (isCommand) 
            this.undoredo.pushCommand(new ActionAddSection(section.id, this.container, this.model, {
                element: section,
                parentType: "section-container",
                position: (this.model.sections.length - 1)
            }));
    }

    removeSection(sectionId) {
        this.undoredo.pushCommand(new ActionRemoveSection(sectionId, this.container, this.model, {
            element: $.extend({}, this.model.findObject(sectionId)),
            parentType: "section-container",
            position: Utils.findIndexObjectInArray(this.model.sections, "id", sectionId)
        }));

        this.deleteToolTipError(document.getElementById("sec-" + sectionId).querySelector('[data-prev]'));
        this.model.removeElement(sectionId);
        $(document.getElementById("sec-" + sectionId).parentNode).fadeOut(400, function () {
            $(this).remove();
        });

        Utils.notifySuccess(this.i18n.translate("messages.deletedSection"));
    }

    swap(sectionOriginId, direction) {
        var positionQuery = (direction == 1) ? $(document.getElementById("sec-" + sectionOriginId).parentNode).prev() : $(document.getElementById("sec-" + sectionOriginId).parentNode).next();

        if (positionQuery.length == 1) {
            var targetOrigin = positionQuery[0].firstElementChild.dataset.id;
            Utils.swap(document.getElementById("sec-" + sectionOriginId).parentNode, document.getElementById("sec-" + targetOrigin).parentNode);
            this.model.swap(sectionOriginId, targetOrigin);
        }

        this.undoredo.pushCommand(new ActionSwapSections(null, this.container, this.model, {
            sectionOriginId: sectionOriginId,
            direction: direction
        }));
    }

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

    removeElement(id) {
        var elementToBeRemoved = this.model.findObject(id);
        var parent = this.model.findParentOfObject(id);

        var parentContainerId = parent.id;
        var parentContainerIndex = -1;
        var inPositionElementId = -1;

        let objectIndex, positionIndex;
        if (parent.type == 'layout') {
            for (var i = 0; i < parent.data.length; i++) {
                var elementArray = parent.data[i];
                objectIndex = Utils.findIndexObjectInArray(elementArray, "id", id);
                if (objectIndex != -1) {
                    positionIndex = objectIndex + 1;
                    if (positionIndex < elementArray.length) inPositionElementId = elementArray[positionIndex].id;
                    parentContainerIndex = i;
                }
            }
        } else {
            objectIndex = Utils.findIndexObjectInArray(parent.data, "id", id);
            positionIndex = objectIndex + 1;
            if (positionIndex < parent.data.length) inPositionElementId = parent.data[positionIndex].id;
        }

        this.undoredo.pushCommand(new ActionRemoveElement(id, this.container, this.model, {
            element: $.extend({}, elementToBeRemoved),
            parentType: parent.type,
            parentContainerIndex: parentContainerIndex,
            parentContainerId: parentContainerId,
            inPositionElementId: inPositionElementId
        }));

        this.deleteToolTipError(document.querySelector("[data-id='" + id + "']").querySelector('[data-prev]'));
        this.model.removeElement(id);
        $(document.querySelector("[data-id='" + id + "']")).fadeOut(400, function () {
            $(this.parentNode).remove();
        });
    }

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

    addSpecificContent(containerId, widgetTypeToCreate) {
        const target = document.querySelector('[data-id="' + containerId + '"]');
        const dataElementId = Utils.generate_uuid();
        const elementToBeAppended = ModelManager.getWidget(widgetTypeToCreate).createElement({ id: dataElementId });
        target.querySelector('[data-content]').innerHTML = elementToBeAppended;
        
        const parentType = target.dataset.type; // Parent type
        const parentContainerIndex = -1; // Parent container index (only for layout)
        const parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
        const inPositionElementId = -1;

        const modelObject = this.model.createObject(widgetTypeToCreate, dataElementId);
        this.model.appendObject(modelObject, inPositionElementId, parentContainerId, parentContainerIndex);
        this.undoredo.pushCommand(new ActionAddElement(dataElementId, this.container, this.model, {
            element: $.extend({}, modelObject),
            parentType: parentType,
            parentContainerIndex: parentContainerIndex,
            parentContainerId: parentContainerId,
            inPositionElementId: inPositionElementId
        }));
    }

    toggleCategory(category) {
        var divCategory = document.querySelector("[data-category-header='" + category + "']");
        var icon = divCategory.querySelector("[data-icon]");
        var isHidden = divCategory.dataset.hidden === 'true';
        $(icon).toggleClass("fa-caret-down", !isHidden);
        $(icon).toggleClass("fa-caret-up", isHidden);
        $("[data-category=" + category + "]").toggle(isHidden);
        divCategory.dataset.hidden = !isHidden;
    }

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

    loadElement(target, element) {

        let modelElement = element.widget === "Section" ? ModelManager.getSection() : ModelManager.getWidget(element.widget);
        const el = modelElement.createElement(element);
        $(target).append(el);
        const previewElement = document.querySelector('[data-id="'+element.id+'"]').querySelector('[data-prev]');
        previewElement.innerHTML = modelElement.preview(element);
    }

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

    creatToolTipError = function (title, previewElement) {
        previewElement.dataset.title = title;
        previewElement.dataset['originalTitle'] = title;
        previewElement.addEventListener('mouseenter', $(previewElement).tooltip('show'));
        previewElement.addEventListener('mouseleave', $(previewElement).tooltip('hide'));
    }

    deleteToolTipError(previewElement) {
        delete previewElement.dataset.title;
        delete previewElement.dataset['originalTitle'];
        previewElement.removeEventListener('mouseenter', $(previewElement).tooltip('show'));
        previewElement.removeEventListener('mouseout', $(previewElement).tooltip('hide'));
        $(previewElement).tooltip('dispose');
    }

    findElementByDataId(dataId) {
        return document.querySelector("[data-id='" + dataId + "']");
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
