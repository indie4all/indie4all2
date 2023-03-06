import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData } from "../../../types";

export default class WidgetTabContent extends WidgetContainerElement {

    protected static copyable: boolean = false;

    static widget = "TabContent";
    static type = "element-container";
    static category = "containers";
    static icon = icon;
    static cssClass = "widget-tab-content";
    static paletteHidden = true;

    data: WidgetElement[];
    params: { name: string };

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { name: "" };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
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

    preview(): string {
        return this.translate("widgets.TabContent.label") + " " + (this.params?.name ?? "");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.name;
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