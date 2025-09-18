import { inject, injectable } from "inversify";
import { Subject } from "rxjs";
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
    private _currentErrors: { element: string, keys: string[] }[];
    get currentErrors(): { element: string, keys: string[] }[] {
        return this._currentErrors;
    }
    
    private _analytics: string;
    get analytics(): string { return this._analytics; }
    set analytics(analytics: string) { this._analytics = analytics; }

    private _color: string;
    get color(): string { return this._color; }
    set color(color: string) { this._color = color; }

    private _cover: string;
    get cover(): string { return this._cover; }
    set cover(cover: string) { this._cover = cover; }

    private _email: string;
    get email(): string { return this._email; }
    set email(email: string) { this._email = email; }

    private _institution: string;
    get institution(): string { return this._institution; }
    set institution(institution: string) { this._institution = institution; }

    private _language: string;
    get language(): string { return this._language; }
    set language(language: string) { this._language = language; }

    private _license: string;
    get license(): string { return this._license; }
    set license(license: string) { this._license = license; }

    private _mode: string;
    get mode(): string { return this._mode; }
    set mode(mode: string) { this._mode = mode; }

    private _resourceId: string;
    get resourceId(): string { return this._resourceId; }
    set resourceId(resourceId: string) { this._resourceId = resourceId; }

    private _sections: SectionElement[];
    public get numberOfSections(): number { return this._sections.length; }
    public get numberOfVisibleSections(): number { return this._sections.filter(section => !section.hidden).length; }
    public get sectionsHTML(): string[] {
        return this._sections.map(section => section.createElement());
    }

    public addSection(section: SectionElement) {
        this._sections.push(section);
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    public insertSection(section: SectionElement, position: number) {
        if (position >= this._sections.length) {
            this._sections.push(section);
        } else {
            this._sections.splice(position, 0, section);
        }
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }
    public indexOfSection(sectionId: string): number {
        return this._sections.findIndex(section => section.id === sectionId);
    }
    

    private _theme: string;
    get theme(): string { return this._theme; }
    set theme(theme: string) { this._theme = theme; }
    
    private _title: string;
    get title(): string { return this._title; }
    set title(title: string) { this._title = title; }

    private _user: string;
    get user(): string { return this._user; }
    set user(user: string) { this._user = user; }

    private _version: string;
    get version(): string { return this.version; }
    set version(version: string) { this._version = version; }
    
    private modelChangedSubject = new Subject<void>();
    private modelChanged$ = this.modelChangedSubject.asObservable();

    constructor(
        @inject(MigratorService) private migrator: MigratorService,
        @inject(I18nService) private i18n: I18nService,
        @inject("Factory<Element>") private elementFactory: (widget: string, values: any) => Promise<Element>,
        @inject(UtilsService) private utils: UtilsService
    ) {
        this._sections = [];
        this._currentErrors = [];
    }

    get empty() : boolean {
        return this._sections.length === 0;
    }

    get modelChanged() {
        return this.modelChanged$;
    }

    get texts(): any {
        return { "sections": this._sections.map(section => section.texts) };
    }

    set texts(texts: any) {
        (texts.sections as any[]).map((text, idx) => this._sections[idx].texts = text);
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    // Check if the element is a model or a model element
    private isModel(element: Model | Element): element is Model {
        return (element as Model)._sections !== undefined;
    }

    /**
     * Get all the descendants of the model or a given model element
     * @param element Model or model element to get the descendants from
     * @returns list of ModelElement children
     */
    private findAllElements(element: Model | Element): Element[] {
        let result: Element[] = this.isModel(element) ? [...element._sections] : [];
        let children: Element[] = this.isModel(element) ? [...element._sections] : [element];

        do {
            children = children
                .filter(elem => (<typeof Element>elem.constructor).hasChildren())
                .flatMap(elem => elem.data.flat());
            result = result.concat(children);
        } while (children.length);
        return result;
    }

    /**
     * Get all the descendants of the model or a given model element of a given type
     * @param element Model or model element to get the descendants from
     * @param typeT Type of the descendants to get
     * @returns list of TypeT children
     */
    private findElementsOfType<T extends Element>(element: Model | Element, typeT: new () => T): T[] {
        return this.findAllElements(element).filter(elem => elem instanceof typeT).map(elem => elem as T);
    }


    async init(model: any): Promise<void> {
        await this.migrator.migrate(model);
        this._version = model.version;
        this._title = model.title;
        this._user = model.user;
        this._email = model.email;
        this._institution = model.institution;
        this._resourceId = model.resourceId;
        this._language = model.language;
        this._theme = model.theme;
        this._license = model.license;
        this._analytics = model.analytics;
        this._color = model.color;
        this._cover = model.cover;
        this._sections = model.sections ? await Promise.all(model.sections.map((sectionData: any) =>
            this.elementFactory('Section', sectionData)
        )) : [];
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    clear() { 
        this._sections = []; 
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    edit(elementId: string, onEdit?: (before: any, now: any) => void): void {
        const elem = this.findObject(elementId);
        const before = elem.toJSON();
        elem.edit(async (data) => {
            const now = elem.toJSON();
            onEdit && onEdit(before, now);
            // Notify that the model has changed
            this.modelChangedSubject.next();
        });
    }

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
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    removeElement(dataElementId: string) {
        this.removeElementInModel(this._sections, dataElementId);
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    private removeElementInModel(elementsArray: Element[], dataElementId: string): void {
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
        return this.findAllElements(this).find(elem => elem.id == dataElementId) as Element;
    }

    findParentOfObject(dataElementId: string): Element {
        return <Element>this.findAllElements(this)
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
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    moveElementFromContainerToAnother(elementId: string, inPositionElementId: string, targetContainerId: string, targetContainerIndex: number) {
        const modelObject = this.findObject(elementId);
        this.removeElement(modelObject.id);
        this.appendObject(modelObject, inPositionElementId, targetContainerId, targetContainerIndex);
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    swap(originId: string, targetId: string) {
        var secArray = this._sections;
        const old_index = secArray.findIndex(elem => elem['id'] == originId);
        const new_index = secArray.findIndex(elem => elem['id'] == targetId);
        this.utils.array_move(secArray, old_index, new_index);
        // Notify that the model has changed
        this.modelChangedSubject.next();
    }

    validate() {
        const self = this;
        const errors: { element: string, keys: string[] }[] = [];
        self._sections.forEach(section => {
            const keys = section.validateModel();
            if (keys.length > 0)
                errors.push({ element: section.id, keys });
            section.data.forEach(element => self.validateElement(element, errors));
        });
        // At most one RelatedUnits widget is allowed
        const relatedUnitsWidgets = this.findElementsOfType(this, RelatedUnitsContainerElement);
        if (relatedUnitsWidgets.length > 1) {
            relatedUnitsWidgets.forEach(widget => {
                const error = errors.find(error => error.element == widget.id);
                if (error) error.keys.push('RelatedUnitsContainer.moreThanOne');
                else errors.push({ element: widget.id, keys: ['RelatedUnitsContainer.moreThanOne'] });
            });
        }

        // No callout elements are allowed directly or indirectly inside a callout
        const calloutElements = this.findElementsOfType(this, CalloutElement);
        if (calloutElements.length > 0) {
            calloutElements.forEach(callout => {
                const calloutChildren = this.findElementsOfType(callout, CalloutElement);
                if (calloutChildren.length > 0) {
                    const error = errors.find(error => error.element == callout.id);
                    if (error) error.keys.push('Callout.calloutInsideCallout');
                    else errors.push({ element: callout.id, keys: ['Callout.calloutInsideCallout'] });
                }
            });
        }
        // Save the errors  
        this._currentErrors = errors;
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
        const sections = this._sections;

        const recursiveIsUnique = function (element: Element, name: string, currentElementId: string) {
            if (element.params?.name && (element.params.name == name && element.id != currentElementId))
                return false;
            if (!(<typeof Element>element.constructor).hasChildren())
                return true;
            return element.data.flat().every((elem: Element) => recursiveIsUnique(elem, name, currentElementId));
        }

        return sections.every(section => recursiveIsUnique(section, name, currentElementId));
    }

    update(form: any) {
        this._title = form.title;
        this._user = form.user;
        this._email = form.email;
        this._institution = form.institution;
        this._language = form.language;
        this._theme = form.theme;
        this._license = form.license;
        this._color = form.color;
        this._cover = form.cover;
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
            version: this._version,
            sections: this._sections.map(section => section.toJSON()),
            // Regenerate resourceId every time the model is serialized
            resourceId: this.utils.generate_uuid()
        }
        if (this._title) result["title"] = this._title;
        if (this._user) result["user"] = this._user;
        if (this._email) result["email"] = this._email;
        if (this._institution) result["institution"] = this._institution;
        if (this._language) result["language"] = this._language;
        if (this._theme) result["theme"] = this._theme;
        if (this._license) result["license"] = this._license;
        if (this._color) result["color"] = this._color;
        if (this._cover) result["cover"] = this._cover;
        result['mode'] = Config.isLocal() ? 'Local' : 'Open';
        result['analytics'] = 0;
        return result;
    }
}