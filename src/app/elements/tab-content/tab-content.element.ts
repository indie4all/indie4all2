import './styles.scss';
import icon from "./icon.png";
import { InputWidgetTabContentData, WidgetInitOptions, WidgetTabContentParams } from "../../../types";
import ContainerElement from "../container/container.element";
import WidgetElement from "../widget/widget.element";

export default class TabContentElement extends ContainerElement {

    static widget = "TabContent";
    static icon = icon;

    data: WidgetElement[];
    params: WidgetTabContentParams;

    constructor() { super(); }

    async init(values?: InputWidgetTabContentData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : { name: "" };
        this.skipNameValidation = true;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            name: this.params ? this.params.name : ''
        }));
    }

    get texts() {
        return { "name": this.params.name, "children": this.data.map(child => child.texts) }
    }

    get preview(): string {
        return this.translate("widgets.TabContent.label") + " " + (this.params?.name ?? "");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.name;
    }

    set texts(texts: any) {
        this.params.name = texts.name;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].texts = text);
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!this.utils.hasNameInParams(this)) errors.push("TabContent.name.invalid");
        if (this.data.length == 0) errors.push("TabContent.data.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        if (form.name.length == 0)
            return ["TabContent.name.invalid"]
        return [];
    }
}