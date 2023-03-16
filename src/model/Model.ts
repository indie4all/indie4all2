import I18n from "../I18n";
import Utils from "../Utils";
import Migrator from "./migration/Migrator";
import ModelElement from "./ModelElement";
import Section from "./section/Section";
import WidgetColumnsLayout from "./widgets/WidgetColumnsLayout/WidgetColumnsLayout";
import WidgetElement from "./widgets/WidgetElement/WidgetElement";

export class Model {

    version: string;
    i18n: I18n;
    sections: Section[];
    title: string;
    user: string;
    email: string;
    institution: string;
    resourceId: string;
    mode: string;
    language: string;
    theme: string;
    license: string;
    analytics: string;
    currentErrors: { element: string, keys: string[] }[];

    constructor(model: any) {
        Migrator.migrate(model);
        this.version = model.version;
        this.i18n = I18n.getInstance();
        this.sections = model.sections ? model.sections.map((sectionData: any) => new Section(sectionData)) : [];
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

    appendObject(modelObject: ModelElement, inPositionElementId: string, parentContainerId: string, parentContainerIndex: number) {
        const parent = this.findObject(parentContainerId);
        const container = parent instanceof WidgetColumnsLayout ? parent.data[parentContainerIndex] : parent.data;
        if (!inPositionElementId)
            container.push(modelObject);
        else {
            const index = Utils.findIndexObjectInArray(container, 'id', inPositionElementId);
            container.splice(index, 0, modelObject);
        }
    }

    removeElement(dataElementId: string) {
        this.removeElementInModel(this.sections, dataElementId);
    }

    removeElementInModel(elementsArray: ModelElement[], dataElementId: string): void {
        elementsArray.forEach((elem, idx, arr) => {
            if (elem.id == dataElementId) arr.splice(idx, 1);
            if ((<typeof ModelElement>elem.constructor).hasChildren()) {
                if (elem instanceof WidgetColumnsLayout)
                    elem.data.forEach(subArr => this.removeElementInModel(subArr, dataElementId));
                else
                    this.removeElementInModel(elem.data, dataElementId);
            }
        });
    }

    findObject(dataElementId: string): ModelElement {
        return <ModelElement>Utils.findAllElements(this).find(elem => elem.id == dataElementId);
    }

    findParentOfObject(dataElementId: string): ModelElement {
        return <ModelElement>Utils.findAllElements(this)
            .filter(elem => (<typeof ModelElement>elem.constructor).hasChildren())
            .find((elem: ModelElement) => {
                return elem.data.flat().find((child: ModelElement) => child.id == dataElementId);
            });
    }

    moveElementWithinContainer(elementId: string, newPosition: number, containerId: string, containerIndex: number) {
        var container = this.findObject(containerId);
        var elementsArray = containerIndex ? container.data[containerIndex] : container.data;
        var currentPosition = Utils.findIndexObjectInArray(elementsArray, 'id', elementId);
        Utils.array_move(elementsArray, currentPosition, newPosition);
    }

    moveElementFromContainerToAnother(elementId: string, inPositionElementId: string, targetContainerId: string, targetContainerIndex: number) {
        const modelObject = this.findObject(elementId);
        this.removeElement(modelObject.id);
        this.appendObject(modelObject, inPositionElementId, targetContainerId, targetContainerIndex);
    }

    swap(originId: string, targetId: string) {
        var secArray = this.sections;
        const old_index = secArray.findIndex(elem => elem['id'] == originId);
        const new_index = secArray.findIndex(elem => elem['id'] == targetId);
        Utils.array_move(secArray, old_index, new_index);
    }

    validate() {
        const self = this;
        const errors: { element: string, keys: string[] }[] = [];
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

    validateFormElement(modelElement: ModelElement, form: any): string[] {
        let errors: string[] = [];
        // If they have name, all the elements must have an unique name
        if (!modelElement.skipNameValidation && form.instanceName && !this.isUniqueName(form.instanceName, modelElement.id))
            errors.push("common.name.notUniqueName");
        errors = errors.concat(modelElement.validateForm(form));
        return errors;
    }

    validateElement(element: WidgetElement, errors: { element: string, keys: string[] }[]) {
        let validationErrors: string[] = [];

        if (!element.skipNameValidation && element.params?.name && !this.isUniqueName(element.params.name, element.id))
            validationErrors.push("common.name.notUniqueName");

        validationErrors = validationErrors.concat(element.validateModel());
        if (validationErrors.length > 0)
            errors.push({ element: element.id, keys: validationErrors });

        if ((<typeof ModelElement>element.constructor).hasChildren()) {
            element.data.flat().forEach((elem: WidgetElement) => this.validateElement(elem, errors));
        }
    }

    isUniqueName(name: string, currentElementId: string) {
        var sections = this.sections;

        var recursiveIsUnique = function (element: ModelElement, name: string, currentElementId: string) {

            if (element.params?.name && (element.params.name == name && element.id != currentElementId))
                return false;

            if (!(<typeof ModelElement>element.constructor).hasChildren())
                return true;

            return element.data.flat().every((elem: ModelElement) => recursiveIsUnique(elem, name, currentElementId));
        }

        return sections.every(section => recursiveIsUnique(section, name, currentElementId));
    }

    update(form: any) {
        this.title = form.title;
        this.user = form.user;
        this.email = form.email;
        this.institution = form.institution;
        this.language = form.language;
        this.theme = form.theme;
        this.license = form.license;
    }

    toJSON() {
        const result: {
            version: string,
            sections: Section[],
            title?: string,
            user?: string,
            email?: string,
            institution?: string,
            resourceId: string,
            language?: string,
            theme?: string,
            license?: string
        } = {
            version: this.version,
            sections: this.sections,
            // Regenerate resourceId every time the model is serialized
            resourceId: Utils.generate_uuid()
        }
        if (this.title) result["title"] = this.title;
        if (this.user) result["user"] = this.user;
        if (this.email) result["email"] = this.email;
        if (this.institution) result["institution"] = this.institution;
        if (this.language) result["language"] = this.language;
        if (this.theme) result["theme"] = this.theme;
        if (this.license) result["license"] = this.license;
        return result;
    }
}
