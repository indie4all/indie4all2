import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAcordionContentData, WidgetAcordionContentParams, WidgetInitOptions } from '../../../types';
import ContainerElement from '../container/container.element';
import ItemElement from '../item/item.element';

export default class AccordionContentElement extends ContainerElement {

    protected static _copyable: boolean = false;

    static widget = "AcordionContent";
    static icon = icon;
    params: WidgetAcordionContentParams;
    data: ItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetAcordionContentData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : { title: "" };
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                title: this.params.title
            }));
    }

    get preview() { return this.title + " " + (this.params?.title ?? ""); }

    get texts() { return { "title": this.params.title, "children": this.data.map(child => child.texts) }; }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.title = form.title;
    }

    set texts(texts: any) {
        this.params.title = texts.title;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].texts = text);
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.title.length == 0) errors.push("AcordionContent.title.invalid");
        if (this.data.length == 0) errors.push("AcordionContent.data.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        if (form.title.length == 0)
            return ["AcordionContent.title.invalid"]
        return [];
    }
}