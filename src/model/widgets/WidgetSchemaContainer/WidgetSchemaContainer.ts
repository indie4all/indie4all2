import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetSchemaItem from "../WidgetSchemaItem/WidgetSchemaItem";
import { FormEditData, InputWidgetSchemaContainerData, WidgetSchemaContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetSchemaContainer extends WidgetContainerSpecificElement {

    static widget = "SchemaContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetSchemaContainerParams;
    data: WidgetSchemaItem[]

    static async create(values?: InputWidgetSchemaContainerData): Promise<WidgetSchemaContainer> {
        const container = new WidgetSchemaContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetSchemaContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Schema-" + this.id,
            help: ""
        };
    }

    clone(): WidgetSchemaContainer {
        const widget = new WidgetSchemaContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Schema-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.SchemaContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.SchemaContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("SchemaContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }

}