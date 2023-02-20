import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetButtonTextItem from "../WidgetButtonTextItem/WidgetButtonTextItem";
import { FormEditData } from "../../../types";

export default class WidgetButtonTextContainer extends WidgetContainerElement {

    static widget = "ButtonTextContainer";
    static type = "specific-element-container";
    static allow = ["ButtonTextItem"];
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-button-text";

    data: WidgetButtonTextItem[]

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Buttons with text-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetButtonTextContainer {
        return new WidgetButtonTextContainer(this);
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
            title: this.translate("widgets.ButtonTextContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.ButtonTextContainer.label");
    }

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = "Buttons with text-" + this.id;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("ButtonTextContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
