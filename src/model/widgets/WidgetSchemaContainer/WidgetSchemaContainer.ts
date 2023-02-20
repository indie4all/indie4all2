import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetSchemaItem from "../WidgetSchemaItem/WidgetSchemaItem";
import { FormEditData } from "../../../types";

export default class WidgetSchemaContainer extends WidgetContainerElement {

    static widget = "SchemaContainer";
    static type = "specific-element-container";
    static allow = ["SchemaItem"];
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-schema-container";

    params: { name: string, help: string }
    data: WidgetSchemaItem[]

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Schema-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetSchemaContainer {
        return new WidgetSchemaContainer(this);
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

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = "Schema-" + this.id;
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