import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetTabContent from "../WidgetTabContent/WidgetTabContent";
import { FormEditData } from "../../../types";
import WidgetSpecificContainerElement from "../WidgetSpecificContainerElement/WidgetSpecificContainerElement";

export default class WidgetTabsContainer extends WidgetSpecificContainerElement {

    static widget = "TabsContainer";
    static category = "containers";
    static icon = icon;

    params: { name: string, help: string }
    data: WidgetTabContent[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Tabs menu-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetTabsContainer {
        const widget = new WidgetTabsContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Tabs menu-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TabsContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.TabsContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("TabsContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}