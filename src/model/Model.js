/* global $ */
import I18n from "../I18n.js";
import Utils from "../Utils.js";
import Migrator from "./migration/Migrator.js";
import Section from "./section/Section.js";

export class Model {

    constructor(model) {
        Migrator.migrate(model);
        this.version = model.version;
        this.i18n = I18n.getInstance();
        this.sections = model.sections ? model.sections.map(sectionData => new Section(sectionData)) : [];
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
     * Returns a copy of the model with its keys changed
     * @param {*} original 
     * @returns 
     */
    copyElement(original) {
        let copy = original.clone();
        copy.regenerateIDs();
        // this.#regenerateModelKeys(copy);
        return copy;   
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
            if (elem.hasChildren()) {
                if (elem.type === "layout") 
                    elem.data.forEach(subArr => this.removeElementInModel(subArr, dataElementId));
                else
                    this.removeElementInModel(elem.data, dataElementId);
            }
        });
    }
    
    findObject(dataElementId) {
        return Utils.findAllElements(this).find(elem => elem.id == dataElementId);
    }

    findParentOfObject(dataElementId) {
        return Utils.findAllElements(this)
            .filter(elem => elem.hasChildren())
            .find(elem => {
                const children = elem.type === 'layout' ? [].concat.apply([], elem.data) : elem.data;
                return children.find(child => child.id == dataElementId);
            });
    }

    moveElementWithinContainer(elementId, newPosition, containerId, containerIndex) {
        var container = this.findObject(containerId);
        var elementsArray = containerIndex ? container.data[containerIndex] : container.data;
        var currentPosition = Utils.findIndexObjectInArray(elementsArray, 'id', elementId);
        Utils.array_move(elementsArray, currentPosition, newPosition);
    }

    moveElementFromContainerToAnother(elementId, inPositionElementId, targetContainerId, targetContainerIndex) {
        var originalObject = this.findObject(elementId);
        var copyOfObject = originalObject.clone();
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
            const keys = section.validateModel();
            if (keys.length > 0) 
                errors.push({ element: section.id, keys });
            section.data.forEach(element => self.validateElement(element, errors));
        });
        // Save the errors   
        this.currentErrors = errors;
        return errors;
    }

    validateFormElement(modelElement, form) {
        let errors = [];
        // If they have name, all the elements must have an unique name
        if (!modelElement.skipNameValidation && form.instanceName && !this.isUniqueName(form.instanceName, modelElement.id))
            errors.push("common.name.notUniqueName");
        errors = errors.concat(modelElement.validateForm(form, modelElement.id));
        return errors;
    }

    validateElement(element, errors) {
        let validationErrors = [];

        if (!element.skipNameValidation && element.params?.name && !this.isUniqueName(element.params.name, element.id))
            validationErrors.push("common.name.notUniqueName");

        validationErrors = validationErrors.concat(element.validateModel());
        if (validationErrors.length > 0) 
            errors.push({ element: element.id, keys: validationErrors});

        if (element.hasChildren()) {
            var elementsArray = element.type == 'layout' ? [].concat.apply([], element.data) : element.data;
            elementsArray.forEach(elem => this.validateElement(elem, errors));
        }
    }

    isUniqueName(name, currentElementId) {
        var sections = this.sections;

        var recursiveIsUnique = function (element, name, currentElementId) {

            if (element.params?.name && (element.params.name == name && element.id != currentElementId))
                return false;

            if (element.hasChildren()) {
                const elementsArray = element.type == 'layout' ? [].concat.apply([], element.data) : element.data;
                return elementsArray.every(elem => recursiveIsUnique(elem, name, currentElementId));
            }
            return true;
        }

        return sections.every(section => recursiveIsUnique(section, name, currentElementId));
    }

    update(formData) {
        this.title = formData.title;
        this.user = formData.user;
        this.email = formData.email;
        this.institution = formData.institution;
        this.language = formData.language;
        this.theme = formData.theme;
        this.license = formData.license;
    }

    toJSON(key) {
        const result = {
            version: this.version,
            sections: this.sections
        }
        if (this.title) result["title"] = this.title;
        if (this.user) result["user"] = this.user;
        if (this.email) result["email"] = this.email;
        if (this.institution) result["institution"] = this.institution;
        // Regenerate resourceId every time the model is serialized
        result["resourceId"] = Utils.generate_uuid(); 
        if (this.language) result["language"] = this.language;
        if (this.theme) result["theme"] = this.theme;
        if (this.license) result["license"] = this.license;
        return result;
    }
}
