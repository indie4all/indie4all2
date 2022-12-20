/* global $ */
/* global bootprompt */
import CryptoJS from 'crypto-js';
import DragDropHandler from "./DragDropHandler";
import I18n from "./I18n";
import { Model } from "./model/Model";
import UndoRedo from "./undoredo";
import Utils from "./Utils";
import ModelManager from "./model/ModelManager";
import ActionAddElement from "./actions/ActionAddElement"
import ActionAddSection from "./actions/ActionAddSection"
import ActionMoveContainer from "./actions/ActionMoveContainer"
import ActionMoveElement from "./actions/ActionMoveElement"
import ActionRemoveElement from "./actions/ActionRemoveElement"
import ActionRemoveSection from "./actions/ActionRemoveSection"
import ActionSwapSections from "./actions/ActionSwapSections"
import widgetsJson from "./model/widgets/widgets.json"
import alertErrorTemplate from "./views/alertError.hbs";
import categoryTemplate from "./views/category.hbs"
import loadingTemplate from "./views/loading.hbs"
import "./styles/common-styles.scss";

export default class Author {

    constructor(palette, container, initCallBack) {

        // TODO: fix this, not very smart
        const ddMove = (el, target) => this.onMoveElement(el, target);
        const ddMoveIntoContainer = (el, target, sibling) => 
            this.onMoveElementIntoContainer(el, target, sibling);
        const ddCreate = (el, target, sibling) => this.onCreateElement(el, target, sibling);

        this.version = "1.12.2";
        this.widgets = {};
        this.model = new Model({});
        this.undoredo = UndoRedo.getInstance();
        this.transform = {};
        this.strings = {};
        this.plugins = {};
        this.api = {};
        this.icons = {};
        this.dragDropHandler = new DragDropHandler(palette, container, ddMove, ddMoveIntoContainer, ddCreate);
        this.i18n = I18n.getInstance();
        this.loadWidgets(palette);
        this.palette = palette;
        this.container = container;
        if (initCallBack) initCallBack();
        !$('#modal-loading').length && $(this.container).after(loadingTemplate());
    }

    showLoading() {
        const $modal = $('#modal-loading');
        $modal.modal({ show: true, keyboard: false, backdrop: 'static'});
    }

    hideLoading() {
        $('#modal-loading').modal('hide');
    }

    onMoveElement(el, target) {

        var elementId = el.firstChild.dataset.id;
        var containerType = target.dataset.type;
        // New order of the elements inside the target
        var targetChildren = [].slice.call(target.children).map(function (ch) {
            return ch.firstChild.dataset.id;
        });

        var newPosition = targetChildren.indexOf(el.firstChild.dataset.id, 0);

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
        var elementId = el.firstChild.dataset.id;
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
        var inPositionElementId = sibling != null ? sibling.firstChild.dataset.id : -1;
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
            element: $.extend({}, element),
            view: this.findElementByDataId(elementId).parentNode.outerHTML
        }));

        // Move
        this.model.moveElementFromContainerToAnother(elementId, inPositionElementId, containerId, containerIndex);
    }

    onCreateElement(el, target, sibling) {
        var elementType = el.dataset.type; // Element type (element, container)
        var widget = el.dataset.widget; // Widget type (TextBlock, Image...etc)
        var parentType = target.dataset.type; // Parent type
        var parentContainerIndex = -1; // Parent container index (only for layout)
        if (parentType == 'layout') parentContainerIndex = target.dataset.index;
        var parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
        var dataElementId = Utils.generate_uuid();
        var inPositionElementId = sibling != null ? sibling.firstChild.dataset.id : -1;
        this.createViewElement(elementType, widget, el, dataElementId, parentType, parentContainerIndex, parentContainerId, inPositionElementId, true);
        this.undoredo.pushCommand(new ActionAddElement(dataElementId, this.container, this.model, {
            element: $.extend({}, this.model.findObject(dataElementId)),
            parentType: parentType,
            parentContainerIndex: parentContainerIndex,
            parentContainerId: parentContainerId,
            inPositionElementId: inPositionElementId,
            view: el.outerHTML
        }));
    }

    copyModelElement(element, section, isCommand) {
        let copy = this.model.copyElement(element);
        let container = document.getElementById('section-elements-' + section.id);
        this.loadElement(container, copy, false, false);
        section.data.push(copy);
        if (isCommand) {
            const action = new ActionAddElement(copy.id, this.container, this.model, {
                element: copy,
                parentType: 'section-container',
                parentContainerIndex: this.model.sections.indexOf(section),
                parentContainerId: section.id,
                inPositionElementId: -1, // Change
                view: $(`[data-id=${copy.id}]`).closest('.container-item').prop('outerHTML')
            });
            this.undoredo.pushCommand(action);
        }
    }

    importElement(sectionId, isCommand) {
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const encrypted = localStorage.getItem('copied-element');
            const json = CryptoJS.AES.decrypt(encrypted, userCookie.split('=')[1]).toString(CryptoJS.enc.Utf8);
            if (json) {
                const position = Utils.findIndexObjectInArray(this.model.sections, "id", sectionId);
                const section = this.model.sections[position];
                this.copyModelElement(JSON.parse(json), section, isCommand);
                Utils.notifySuccess(this.i18n.translate("messages.importedElement"));
                return;
            }
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.i18n.translate("messages.noElement"));
        
        } catch (err) {
            localStorage.removeItem('copied-element');
            Utils.notifyWarning(this.i18n.translate("messages.noElement"));    
        }    
    }

    exportElement(elementId) {
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const key = userCookie.split('=')[1];
            const original = this.model.findObject(elementId);
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(original), key).toString();
            localStorage.setItem('copied-element', encrypted);
            Utils.notifySuccess(this.i18n.translate("messages.exportedElement"));
        } catch (err) {
            Utils.notifyWarning(this.i18n.translate("messages.couldNotExportElement"));
        }
    }

    copyElement = function (elementId, isCommand) {
        let sectionId = $(`[data-id=${elementId}]`).closest('.section-elements').attr('id').split('-').at(-1);
        let position = Utils.findIndexObjectInArray(this.model.sections, "id", sectionId);
        let section = this.model.sections[position];
        this.copyModelElement(this.model.findObject(elementId), section, isCommand);
    }

    copyModelSection = function (section, isCommand) {
        let copy = this.model.copyElement(section);
        this.model.sections.push(copy);
        this.loadElement(this.container, copy, true, false);
        if (isCommand) {
            this.undoredo.pushCommand(new ActionAddSection(copy.id, this.container, this.model, {
                element: copy,
                parentType: "section-container",
                view: $('#sec-' + copy.id).closest('.section-container').prop('outerHTML'),
                position: (this.model.sections.length - 1)
            }));
        }
    }

    importSection = function (isCommand) {
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const encrypted = localStorage.getItem('copied-section');
            const json = CryptoJS.AES.decrypt(encrypted, userCookie.split('=')[1]).toString(CryptoJS.enc.Utf8);
            if (json) {
                this.copyModelSection(JSON.parse(json), isCommand);
                Utils.notifySuccess(this.i18n.translate("messages.importedSection"));
                return;
            }
            localStorage.removeItem('copied-section');
            Utils.notifyWarning(this.i18n.translate("messages.noSection"));
        } catch (err) {
            localStorage.removeItem('copied-section');
            Utils.notifyWarning(this.i18n.translate("messages.noSection"));
        } 
    }

    exportSection(elementId) {
        try {
            const userCookie = document.cookie && document.cookie.split('; ').find(cookie => cookie.startsWith('INDIE_USER='));
            const key = userCookie.split('=')[1];
            const original = this.model.findObject(elementId);
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(original), key).toString();
            localStorage.setItem('copied-section', encrypted);
            Utils.notifySuccess(this.i18n.translate("messages.exportedSection"));
        } catch (err) {
            Utils.notifyWarning(this.i18n.translate("messages.couldNotExportSection"));
        }    
    }

    copySection(sectionId, isCommand) {
        let position = Utils.findIndexObjectInArray(this.model.sections, "id", sectionId);
        this.copyModelSection(this.model.sections[position], isCommand);
    }

    addSection(sectionId, isCommand) {
        const section = sectionId ? this.model.findObject(sectionId) : this.model.createSection();
        const rendered = ModelManager.getSection().createElement(section);
        $(this.container).append(rendered);
        if (isCommand) 
            this.undoredo.pushCommand(new ActionAddSection(section.id, this.container, this.model, {
                element: section,
                parentType: "section-container",
                view: rendered,
                position: (this.model.sections.length - 1)
            }));
    }

    removeSection(sectionId) {
        this.undoredo.pushCommand(new ActionRemoveSection(sectionId, this.container, this.model, {
            element: $.extend({}, this.model.findObject(sectionId)),
            parentType: "section-container",
            position: Utils.findIndexObjectInArray(this.model.sections, "id", sectionId),
            view: this.findElementByDataId(sectionId).parentNode.outerHTML
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

    createViewElement(elementType, widget, viewElement, dataElementId, parentType, parentContainerIndex, parentContainerId, inPositionElementId, modelCreation) {
        // Element setup
        const widgetInfo = { id: dataElementId };
        const widgetElement = ModelManager.getWidget(widget);
        const elementToBeAppended = widgetElement.createElement(widgetInfo);
        const buttons = widgetElement.generateToolbar(dataElementId);
        Utils.clearDataAttributes(viewElement);
        viewElement.innerHTML = '';
        $(viewElement).removeClass('palette-item');
        $(viewElement).addClass('container-item');
        $(viewElement).append(elementToBeAppended);
        const toolbar = $("[data-id='" + dataElementId + "'] [data-toolbar]")[0];
        $(toolbar).append(buttons);        
        if (modelCreation) { // MODEL CREATION
            var modelObject = this.model.createObject(elementType, widget, dataElementId, widgetInfo);
            this.model.appendObject(modelObject, inPositionElementId, parentContainerId, parentContainerIndex);
        }
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
                const previewElement = modelElem.preview(modelObject);
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
            inPositionElementId: inPositionElementId,
            view: this.findElementByDataId(id).parentNode.outerHTML
        }));

        this.deleteToolTipError(document.querySelector("[data-id='" + id + "']").querySelector('[data-prev]'));
        this.model.removeElement(id);
        $(document.querySelector("[data-id='" + id + "']")).fadeOut(400, function () {
            $(this.parentNode).remove();
        });
    }

    addContent(containerId, widget, type) {
        const self = this;
        if (type != 'specific-container' && type != 'specific-element-container')
            throw new Error('Cannot create content for non-specific container');

        var widgetTypeToCreate;

        const widgetElem = ModelManager.getWidget(widget);
        if (widgetElem.config.allow.length > 1) {
            var options = [];

            for (var i = 0; i < widgetElem.config.allow.length; i++) {
                var widgetAllowed = widgetElem.config.allow[i];
                options.push({
                    text: this.i18n.translate(`widgets.${widgetAllowed}.label`),
                    value: widgetAllowed
                });
            }

            bootprompt.prompt({
                title: this.i18n.translate("common.selectType"),
                inputType: 'select',
                inputOptions: options,
                value: widgetElem.config.allow[0], // Default option
                closeButton: false,
                callback: function (result) {
                    if (result) {
                        widgetTypeToCreate = result;
                        self.addSpecificContent(containerId, widgetTypeToCreate);
                    }
                }
            });
        } else {
            widgetTypeToCreate = widgetElem.config.allow[0];
            self.addSpecificContent(containerId, widgetTypeToCreate);
        }
    }

    addSpecificContent(containerId, widgetTypeToCreate) {
        var elementTypeToCreate = ModelManager.getWidget(widgetTypeToCreate).config.type;
        var target = document.querySelector('[data-id="' + containerId + '"]');

        var newElement = document.createElement("div");
        target.querySelector('[data-content]').appendChild(newElement);
        var dataElementId = Utils.generate_uuid();

        var parentType = target.dataset.type; // Parent type
        var parentContainerIndex = -1; // Parent container index (only for layout)
        var parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
        var inPositionElementId = -1;

        this.createViewElement(elementTypeToCreate, widgetTypeToCreate, newElement, dataElementId, parentType, parentContainerIndex, parentContainerId, inPositionElementId, true);
        this.undoredo.pushCommand(new ActionAddElement(dataElementId, this.container, this.model, {
            element: $.extend({}, this.model.findObject(dataElementId)),
            parentType: parentType,
            parentContainerIndex: parentContainerIndex,
            parentContainerId: parentContainerId,
            inPositionElementId: inPositionElementId,
            view: newElement.outerHTML
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

    loadElement(target, element, isSection, modelCreation = false) {

        let modelElement;
        if (isSection) {
            modelElement = ModelManager.getSection();
            const section = element.id ? this.model.findObject(element.id) : this.model.createSection();
            const rendered = modelElement.createElement(section);
            $(this.container).append(rendered);
            modelElement.preview(element);
        } else {
            modelElement = ModelManager.getWidget(element.widget);
            const el = document.createElement("div");            
            const parentType = target.dataset.type;
            let parentContainerIndex = -1; // Parent container index (only for layout)
            let parentContainerId = $(target).closest('[data-id]')[0].dataset.id;
            if (element.type == 'layout') el.dataset.columns = element.data.length;
            if (parentType == 'layout') parentContainerIndex = target.dataset.index;    
            $(target).append(el);
            this.createViewElement(element.type, element.widget, el, element.id, parentType, parentContainerIndex, parentContainerId, -1, modelCreation);
            modelElement.preview(element);
        }

        if (modelElement.hasChildren()) {
            
            const viewElement = document.querySelector('[data-id="' + element.id + '"]');
            if (element.type == 'layout') {
                element.data.forEach((columnElements, index) => {
                    const target = viewElement.querySelector('[data-index="' + index + '"');
                    columnElements.forEach(columnElement => this.loadElement(target, columnElement));
                });
            } else {
                var subContainerTarget = 
                (element.type == 'specific-container' || element.type == 'simple-container' || element.type == 'specific-element-container') ? 
                    viewElement.querySelector('[data-content]') : 
                    viewElement.querySelector('[data-role="container"]');
                element.data.forEach(elem => this.loadElement(subContainerTarget, elem));
            }
        }
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
        this.model.sections.forEach(section => 
            this.loadElement(this.container, section, true));
    }
}
