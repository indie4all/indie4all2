import { inject, injectable } from "inversify";
import MigratorService from "../services/migrator/migrator.service";
import I18nService from "../services/i18n/i18n.service";
import UtilsService from "../services/utils/utils.service";
import Element from "./element/element";
import SectionElement from "./section/section.element";
import Config from "../../config";
import ColumnsLayoutElement from "./columns-layout/columns-layout.element";
import WidgetElement from "./widget/widget.element";
import RelatedUnitsContainerElement from "./related-units-container/related-units-container.element";
import CalloutElement from "./callout/callout.element";

@injectable()
export class Model {
    version: string;
    sections: SectionElement[];
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
    color: string;
    cover: string;
    currentErrors: { element: string, keys: string[] }[];

    constructor(
        @inject(MigratorService) private migrator: MigratorService,
        @inject(I18nService) private i18n: I18nService,
        @inject("Factory<Element>") private elementFactory: (widget: string, values: any) => Promise<Element>,
        @inject(UtilsService) private utils: UtilsService
    ) {
        this.sections = [];
        this.currentErrors = [];
    }

    async init(model: any): Promise<void> {
        await this.migrator.migrate(model);
        this.version = model.version;
        this.title = model.title;
        this.user = model.user;
        this.email = model.email;
        this.institution = model.institution;
        this.resourceId = model.resourceId;
        this.language = model.language;
        this.theme = model.theme;
        this.license = model.license;
        this.analytics = model.analytics;
        this.color = model.color;
        this.cover = model.cover;
        this.sections = model.sections ? await Promise.all(model.sections.map((sectionData: any) =>
            this.elementFactory('Section', sectionData)
        )) : [];
    }

    clear() { this.sections = []; }

    appendObject(modelObject: Element, inPositionElementId: string, parentContainerId: string, parentContainerIndex: number) {
        const parent: Element = this.findObject(parentContainerId);
        const container = parent instanceof ColumnsLayoutElement ? parent.data[parentContainerIndex] : parent.data;
        if (!inPositionElementId) {
            container.push(modelObject);
        }
        else {
            const index = this.utils.findIndexObjectInArray(container, 'id', inPositionElementId);
            container.splice(index, 0, modelObject);
        }
    }

    get texts(): any {
        return { "sections": this.sections.map(section => section.texts) };
    }

    set texts(texts: any) {
        (texts.sections as any[]).map((text, idx) => this.sections[idx].texts = text);
    }

    removeElement(dataElementId: string) {
        this.removeElementInModel(this.sections, dataElementId);
    }

    removeElementInModel(elementsArray: Element[], dataElementId: string): void {
        elementsArray.forEach((elem, idx, arr) => {
            if (elem.id == dataElementId) arr.splice(idx, 1);
            if ((<typeof Element>elem.constructor).hasChildren()) {
                if (elem instanceof ColumnsLayoutElement)
                    elem.data.forEach(subArr => this.removeElementInModel(subArr, dataElementId));
                else
                    this.removeElementInModel(elem.data, dataElementId);
            }
        });
    }

    findObject(dataElementId: string): Element {
        return this.utils.findAllElements(this).find(elem => elem.id == dataElementId) as Element;
    }

    findParentOfObject(dataElementId: string): Element {
        return <Element>this.utils.findAllElements(this)
            .filter(elem => (<typeof Element>elem.constructor).hasChildren())
            .find((elem: Element) => {
                return elem.data.flat().find((child: Element) => child.id == dataElementId);
            });
    }

    moveElementWithinContainer(elementId: string, newPosition: number, containerId: string, containerIndex: number) {
        var container = this.findObject(containerId);
        var elementsArray = containerIndex ? container.data[containerIndex] : container.data;
        var currentPosition = this.utils.findIndexObjectInArray(elementsArray, 'id', elementId);
        this.utils.array_move(elementsArray, currentPosition, newPosition);
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
        this.utils.array_move(secArray, old_index, new_index);
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
        // At most one RelatedUnits widget is allowed
        const relatedUnitsWidgets = this.utils.findElementsOfType(this, RelatedUnitsContainerElement);
        if (relatedUnitsWidgets.length > 1) {
            relatedUnitsWidgets.forEach(widget => {
                const error = errors.find(error => error.element == widget.id);
                if (error) error.keys.push('RelatedUnitsContainer.moreThanOne');
                else errors.push({ element: widget.id, keys: ['RelatedUnitsContainer.moreThanOne'] });
            });
        }

        // No callout elements are allowed directly or indirectly inside a callout
        const calloutElements = this.utils.findElementsOfType(this, CalloutElement);
        if (calloutElements.length > 0) {
            calloutElements.forEach(callout => {
                const calloutChildren = this.utils.findElementsOfType(callout, CalloutElement);
                if (calloutChildren.length > 0) {
                    const error = errors.find(error => error.element == callout.id);
                    if (error) error.keys.push('Callout.calloutInsideCallout');
                    else errors.push({ element: callout.id, keys: ['Callout.calloutInsideCallout'] });
                }
            });
        }
        // Save the errors  
        this.currentErrors = errors;
        return errors;
    }

    validateFormElement(modelElement: Element, form: any): string[] {
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
        if (validationErrors.length > 0) {
            errors.push({ element: element.id, keys: validationErrors });
        }
        if ((<typeof Element>element.constructor).hasChildren()) {
            element.data.flat().forEach((elem: WidgetElement) => this.validateElement(elem, errors));
        }
    }

    isUniqueName(name: string, currentElementId: string) {
        var sections = this.sections;

        var recursiveIsUnique = function (element: Element, name: string, currentElementId: string) {

            if (element.params?.name && (element.params.name == name && element.id != currentElementId))
                return false;

            if (!(<typeof Element>element.constructor).hasChildren())
                return true;

            return element.data.flat().every((elem: Element) => recursiveIsUnique(elem, name, currentElementId));
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
        this.color = form.color;
        this.cover = form.cover;
    }

    toJSON() {
        const result: {
            version: string,
            sections: any[],
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
            sections: this.sections.map(section => section.toJSON()),
            // Regenerate resourceId every time the model is serialized
            resourceId: this.utils.generate_uuid()
        }
        if (this.title) result["title"] = this.title;
        if (this.user) result["user"] = this.user;
        if (this.email) result["email"] = this.email;
        if (this.institution) result["institution"] = this.institution;
        if (this.language) result["language"] = this.language;
        if (this.theme) result["theme"] = this.theme;
        if (this.license) result["license"] = this.license;
        if (this.color) result["color"] = this.color;
        if (this.cover) result["cover"] = this.cover;
        result['mode'] = Config.isLocal() ? 'Local' : 'Open';
        result['analytics'] = 0;
        return result;
    }
}