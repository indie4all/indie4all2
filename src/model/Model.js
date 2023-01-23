/* global $ */
import I18n from "../I18n.js";
import Utils from "../Utils.js";
import Migrator from "./migration/Migrator.js";
import ModelManager from "./ModelManager.js";

export class Model {

    constructor(model) {
        Migrator.migrate(model);
        this.version = model.version;
        this.i18n = I18n.getInstance();
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
            children.forEach((child) => this.#regenerateModelKeys(child));
        }
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

    
    createWidget(widget, id) {
        return ModelManager.getWidget(widget).emptyData(id);
    }

    appendObject(modelObject, inPositionElementId, parentContainerId, parentContainerIndex) {
        const parent = this.findObject(parentContainerId);
        const container = parent.type == 'layout' ? parent.data[parentContainerIndex] : parent.data;
        if (inPositionElementId == -1)
            container.push(modelObject);
        else {
            const index = Utils.findIndexObjectInArray(container, 'id', inPositionElementId);
            container.splice(index, 0, modelObject);
        }
    }

    removeElement(dataElementId) {
        this.removeElementInModel(this.sections, dataElementId);
    }

    removeElementInModel(elementsArray, dataElementId) {
        elementsArray.forEach((elem, idx, arr) => {
            if (elem.id == dataElementId) arr.splice(idx, 1);
            if (ModelManager.hasChildren(elem)) {
                if (elem.type === "layout") 
                    elem.data.forEach(subArr => this.removeElementInModel(subArr, dataElementId));
                else
                    this.removeElementInModel(elem.data, dataElementId);
            }
        });
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
        let errors = [];
        // If they have name, all the elements must have an unique name
        if (!modelElement.config.skipNameValidation && form.instanceName && !this.isUniqueName(form.instanceName, dataElementId))
            errors.push("common.name.notUniqueName");
        errors = errors.concat(modelElement.validateForm(form, dataElementId));
        return errors;
    }

    validateElement(element, errors) {
        let validationErrors = [];
        const widget = ModelManager.getWidget(element.widget);

        if (!widget.config.skipNameValidation && element.params?.name && !this.isUniqueName(element.params.name, element.id))
            validationErrors.push("common.name.notUniqueName");

        validationErrors = validationErrors.concat(widget.validateModel(element));
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
