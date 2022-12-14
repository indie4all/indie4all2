/* global $ */
import I18n from "../I18n.js";
import Utils from "../Utils.js";
import ModelManager from "./ModelManager.js";

export class Model {

    static #VERSION_HISTORY = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    constructor(model) {
        this.i18n = I18n.getInstance();
        // TODO: migration from older versions
        this.CURRENT_MODEL_VERSION = model.CURRENT_MODEL_VERSION ?? 9;
        this.sections = model.sections ?? [];
        this.title = model.title;
        this.user = model.user;
        this.email = model.email;
        this.institution = model.institution;
        this.resourceId = model.resourceId;
        this.mode = model.mode;
        this.language = model.language;
        this.theme = model.theme;
        this.license = model.license;
        this.analytics = model.analytics;
        this.currentErrors = [];
    }

    /**
     * Indicates if an element type has children in its data attribute 
     * 
     * @param {string} elementType Element type (specific-container, element-container...)
     * 
     * @returns {boolean} true if has children, false if not
     */
    hasChildren(elementType) {
        return (elementType == 'specific-container' || elementType == 'simple-container' || elementType == 'specific-element-container' || elementType == 'element-container' || elementType == 'layout' || elementType == 'section-container');
    }


    /**
     * Changes the identifiers for the element and its children
     * @param {*} elem 
     */
    #regenerateModelKeys(elem) {

        const modelElement = elem.widget && elem.widget !== 'Section' ? ModelManager.getWidget(elem.widget) : ModelManager.getSection();
        elem.id = Utils.generate_uuid();
        // Set instance name if necessary
        if (elem.params?.name && elem.widget &&
            elem.widget !== 'TabContent') // Fix: params.name in TabContent must be kept as it is
        {
            elem.params.name = modelElement.emptyData().params.name;
        }
        if (modelElement.hasChildren()) {
            let children = elem.type === 'layout' ? elem.data.flat() : elem.data;
            children.forEach(this.#regenerateModelKeys);
        }
    }

    /**
     * Creates a new, empty section
     * @returns Empty section
     */
    createSection() {
        const section = ModelManager.getSection().emptyData(this.sections.length + 1);
        this.sections.push(section);
        return section;
    }

    /**
     * Returns a copy of the model with its keys changed
     * @param {*} original 
     * @returns 
     */
    copyElement(original) {
        let copy = $.extend(true, {}, original);
        this.#regenerateModelKeys(copy);
        return copy;   
    }

    
    createObject = function (elementType, widget, dataElementId, widgetInfo) {
        var modelObject = {
            id: dataElementId,
            type: elementType,
            widget: widget
        }
        const widgetData = ModelManager.getWidget(widget).emptyData(widgetInfo);
        return $.extend(widgetData, modelObject);
    }

    appendObject(modelObject, inPositionElementId, parentContainerId, parentContainerIndex) {
        var parent = this.findObject(parentContainerId);
        if (parent.type == 'layout')
            this.pushOrAppendObject(parent.data[parentContainerIndex], modelObject, inPositionElementId);
        else
            this.pushOrAppendObject(parent.data, modelObject, inPositionElementId);
    }

    pushOrAppendObject(array, modelObject, inPositionElementId) {
        if (inPositionElementId == -1)
            array.push(modelObject);
        else {
            var inPositionIndex = Utils.findIndexObjectInArray(array, 'id', inPositionElementId);
            array.splice(inPositionIndex, 0, modelObject);
        }
    }

    removeElement(dataElementId) {
        var elementsArray = this.sections;
        this.removeElementInModel(elementsArray, dataElementId);
    }

    removeElementInModel(elementsArray, dataElementId) {
        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];

            if (element.id == dataElementId) {
                elementsArray.splice(i, 1);
                return true;
            } else {
                if (element.type == 'layout') {
                    for (var j = 0; j < element.data.length; j++) {
                        var elementsSubArray = element.data[j];
                        if (this.removeElementInModel(elementsSubArray, dataElementId)) return true;
                    }
                } else if (element.type == 'specific-container' || element.type == 'simple-container' || element.type == 'specific-element-container' || element.type == 'element-container' || element.type == 'section-container') {
                    if (this.removeElementInModel(element.data, dataElementId)) return true;
                }
            }
        }

        return false;
    }
    
    findObject(dataElementId) {
        var elementsArray = this.sections;
        var elementSearch;

        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];
            elementSearch = this.findElementOrSubelementInModel(element, dataElementId);

            if (elementSearch)
                break;
        }

        return elementSearch;
    }

    findElementOrSubelementInModel(element, dataElementId) {

        if (element.id == dataElementId)
            return element;

        const modelElement = element.widget && element.widget !== 'Section' ? ModelManager.getWidget(element.widget) : 
            ModelManager.getSection();
        if (modelElement.hasChildren()) {
            var elementsArray = element.type == 'layout' ? [].concat.apply([], element.data) : element.data;
            for (var i = 0; i < elementsArray.length; i++) {
                const result = this.findElementOrSubelementInModel(elementsArray[i], dataElementId);
                if (result) return result;
            }
        }
    }

    findParentOfObject(dataElementId) {

        const findParent = function (parent, elementArray, elementId) {
            for (let i = 0; i < elementArray.length; i++) {
                let element = elementArray[i];
                if (element.id == elementId)
                    return parent;
                
                if (ModelManager.getWidget(element.widget).hasChildren()) {
                    const arr = element.type === 'layout' ? 
                        [].concat.apply([], element.data) : element.data;
                    const subParent = findParent(element, arr, elementId);
                    if (subParent) return subParent;
                }
            }
        }

        for (var i = 0; i < this.sections.length; i++) {
            const section = this.sections[i];
            const parent = findParent(section, section.data, dataElementId);
            if (parent) return parent;
        }
    }

    moveElementWithinContainer(elementId, newPosition, containerId, containerIndex) {
        var container = this.findObject(containerId);
        var elementsArray = containerIndex ? container.data[containerIndex] : container.data;
        var currentPosition = Utils.findIndexObjectInArray(elementsArray, 'id', elementId);
        Utils.array_move(elementsArray, currentPosition, newPosition);
    }

    moveElementFromContainerToAnother(elementId, inPositionElementId, targetContainerId, targetContainerIndex) {
        var originalObject = this.findObject(elementId);
        var copyOfObject = $.extend({}, originalObject)
        this.removeElement(originalObject.id);
        this.appendObject(copyOfObject, inPositionElementId, targetContainerId, targetContainerIndex);
    }

    swap(originId, targetId) {
        var secArray = this.sections;
        var old_index = Utils.findIndexObjectInArray(secArray, 'id', originId);
        var new_index = Utils.findIndexObjectInArray(secArray, 'id', targetId);
        Utils.array_move(secArray, old_index, new_index);
    }

    validate() {
        const self = this;
        const errors = [];
        self.sections.forEach(section => {
            const keys = ModelManager.getSection().validateModel(section);
            if (keys.length > 0) 
                errors.push({ element: section.id, keys });
            section.data.forEach(element => self.validateElement(element, errors));
        });
        // Save the errors   
        this.currentErrors = errors;
        return errors;
    }

    validateFormElement(modelElement, form, dataElementId) {
        const errors = [];
        // If they have name, all the elements must have an unique name
        if (form.instanceName && !this.isUniqueName(form.instanceName, dataElementId))
            errors.push("common.name.notUniqueName");
        errors.concat(modelElement.validateForm(form, dataElementId));
        return errors;
    }

    validateElement(element, errors) {
        const validationErrors = [];

        if (element.params?.name && !this.isUniqueName(element.params.name, element.id))
            validationErrors.push("common.name.notUniqueName");

        const widget = ModelManager.getWidget(element.widget);
        validationErrors.concat(widget.validateModel(element));
        if (validationErrors.length > 0) 
            errors.push({ element: element.id, keys: validationErrors});

        if (widget.hasChildren()) {
            var elementsArray = element.type == 'layout' ? [].concat.apply([], element.data) : element.data;
            elementsArray.forEach(elem => this.validateElement(elem, errors));
        }
    }

    isUniqueName(name, currentElementId) {
        var sections = this.sections;

        var recursiveIsUnique = function (element, name, currentElementId) {

            if (element.params?.name && (element.params.name == name && element.id != currentElementId))
                return false;

            if ((element.widget === "Section" ? ModelManager.getSection() : ModelManager.getWidget(element.widget)).hasChildren()) {
                const elementsArray = element.type == 'layout' ? [].concat.apply([], element.data) : element.data;
                return elementsArray.every(elem => recursiveIsUnique(elem, name, currentElementId));
            }

            return true;
        }

        return sections.every(section => recursiveIsUnique(section, name, currentElementId));
    }
}
