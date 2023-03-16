import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetTestContainer extends WidgetContainerSpecificElement {

    static widget = "Test";
    static category = "exerciseElement";
    static icon = icon;

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetTestContainer.widget + "-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetTestContainer {
        const widget = new WidgetTestContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetTestContainer.widget + "-" + widget.id;
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
            title: this.translate("widgets.Test.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.Test.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Test.data.empty")
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}