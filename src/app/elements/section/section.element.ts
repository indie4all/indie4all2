import './styles.scss';
import Element from "../element/element";
import prevTemplate from "./prev.hbs";
import sectionTemplate from "./template.hbs";
import icon from "./icon.png";
import { InputSectionData, WidgetInitOptions } from '../../../types';
import { injectable } from 'inversify';
import Config from '../../../config';

@injectable()
export default class SectionElement extends Element {

    static widget = "Section";
    static icon = icon;

    protected static _addable: boolean = true;
    protected static _movable: boolean = true;
    protected static _generable: boolean = true;

    static get movable() { return this._movable }
    static set movable(value: boolean) { this._movable = value }

    name: string;
    bookmark: string;
    hidden: boolean;
    data: Element[]

    constructor() { super(); }

    protected get form(): Promise<string> {
        return import('./form.hbs')
            .then((module) => module.default({
                id: this.id,
                name: this.name,
                bookmark: this.bookmark,
                hidden: this.hidden
            }));
    }

    protected get title(): string { return "Section " + this.name; }

    get preview(): string { return prevTemplate(this); }

    async init(values?: InputSectionData, options: WidgetInitOptions = { regenerateId: false }) {
        await super.init(values, options);
        this.name = values?.name ?? (this.i18n.value("sections.label") + " " + (values?.index ?? 0));
        this.bookmark = values?.bookmark ?? "";
        this.hidden = values?.hidden ?? false;
        this.data = values?.data ? await Promise.all(values.data.map((elem: any) => this.create(elem.widget, elem, options))) : [];
    }

    static hasChildren(): boolean { return true; }

    createElement(): string {
        const constructor = this.constructor as typeof SectionElement;
        const preview = this.preview;
        const data = {
            id: this.id,
            icon: SectionElement.icon,
            children: this.data ? this.data.map(child => child.createElement()).join('') : "",
            hidden: this.hidden,
            preview,
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            canMove: constructor.movable,
            canGenerate: !Config.isWidgetEditorEnabled() && !!Config.getAIURL() && constructor.generable
        };
        return sectionTemplate(data);
    }

    get texts() {
        return {
            "name": this.name,
            "bookmark": this.bookmark,
            "children": this.data.map(e => e.texts)
        };
    }

    updateModelFromForm(form: any): void {
        this.name = form.name;
        this.bookmark = form.bookmark;
        this.hidden = form.hidden;
        // Add a section-hidden class to the section element if hidden
        $("#sec-" + this.id).toggleClass('section-hidden', this.hidden);
    }

    set texts(texts: any) {
        this.name = texts.name;
        this.bookmark = texts.bookmark;
        (texts.children as any[]).forEach((child, idx) => this.data[idx].texts = child);
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0)
            keys.push("section.emptyData");
        if (!this.name || (this.name.length <= 0))
            keys.push("section.invalidName");
        if (this.bookmark.length == 0 || this.bookmark.length > 40)
            keys.push("section.invalidBookmark");
        return keys;
    }

    validateForm(form: any): string[] {
        let errors: string[] = [];
        if (form.bookmark.length > 40) {
            errors.push("section.invalidBookmark")
        }
        return errors;
    }

    toJSON() {
        const result = super.toJSON();
        return { ...result, name: this.name, bookmark: this.bookmark, hidden: this.hidden, data: this.data.map(elem => elem.toJSON()) }
    }
}