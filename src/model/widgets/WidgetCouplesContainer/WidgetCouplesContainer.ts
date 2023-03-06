import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetCouplesItem from "../WidgetCouplesItem/WidgetCouplesItem";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetCouplesContainer extends WidgetContainerSpecificElement {

    static widget = "CouplesContainer";
    static type = "specific-element-container";
    static allows() { return [WidgetCouplesItem] };
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-couples-container";

    data: WidgetCouplesItem[]
    params: { name: string, help: string }

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Couples-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetCouplesContainer {
        const widget = new WidgetCouplesContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Couples-" + widget.id;
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
            title: this.translate("widgets.CouplesContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.CouplesContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("CouplesContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
