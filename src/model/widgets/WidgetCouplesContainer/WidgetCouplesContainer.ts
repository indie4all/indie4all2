import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import WidgetCouplesItem from "../WidgetCouplesItem/WidgetCouplesItem";
import { FormEditData, InputWidgetCouplesContainerData, WidgetCouplesContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import ModelManager from "../../../model/ModelManager";

export default class WidgetCouplesContainer extends WidgetContainerSpecificElement {

    static widget = "CouplesContainer";
    static category = "interactiveElements";
    static icon = icon;

    data: WidgetCouplesItem[]
    params: WidgetCouplesContainerParams;

    static async create(values?: InputWidgetCouplesContainerData): Promise<WidgetCouplesContainer> {
        const container = new WidgetCouplesContainer(values);
        container.data = values?.data ? await Promise.all(
            values.data.map(elem => ModelManager.create(elem.widget, elem))) as WidgetCouplesItem[] : [];
        return container;
    }

    constructor(values?: InputWidgetCouplesContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Couples-" + this.id,
            help: ""
        };
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

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
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
