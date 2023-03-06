import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetButtonTextItem from "../WidgetButtonTextItem/WidgetButtonTextItem";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetButtonTextContainer extends WidgetContainerSpecificElement {

    static widget = "ButtonTextContainer";
    static type = "specific-element-container";
    static allows() { return [WidgetButtonTextItem] };
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-button-text";

    data: WidgetButtonTextItem[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Buttons with text-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetButtonTextContainer {
        const widget = new WidgetButtonTextContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Buttons with text-" + widget.id;
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
            title: this.translate("widgets.ButtonTextContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.ButtonTextContainer.label");
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
