import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData, InputWidgetTabContentData, WidgetTabContentParams } from "../../../types";

export default class WidgetTabContent extends WidgetContainerElement {

    protected static copyable: boolean = false;

    static widget = "TabContent";
    static icon = icon;

    data: WidgetElement[];
    params: WidgetTabContentParams;

    static async create(values?: InputWidgetTabContentData): Promise<WidgetTabContent> {
        const container = new WidgetTabContent(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetTabContentData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { name: "" };
        this.skipNameValidation = true;
    }

    clone(): WidgetTabContent {
        const widget = new WidgetTabContent();
        widget.params = structuredClone(this.params);
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            name: this.params ? this.params.name : ''
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TabContent.label")
        };
    }

    getTexts() {
        return { "name": this.params.name }
    }

    preview(): string {
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

    updateTexts(texts: any): void {
        this.params.name = texts.name;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!Utils.hasNameInParams(this)) errors.push("TabContent.name.invalid");
        if (this.data.length == 0) errors.push("TabContent.data.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        if (form.name.length == 0)
            return ["TabContent.name.invalid"]
        return [];
    }
}