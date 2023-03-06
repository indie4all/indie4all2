import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetTrueFalseItem from "../WidgetTrueFalseItem/WidgetTrueFalseItem";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetTrueFalseContainer extends WidgetContainerSpecificElement {

    static widget = "TrueFalseContainer";
    static type = "specific-element-container";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-true-false";

    static allows() { return [WidgetTrueFalseItem]; }

    params: { name: string, help: string }
    data: WidgetTrueFalseItem[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "True false-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetTrueFalseContainer {
        const widget = new WidgetTrueFalseContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "True false-" + widget.id;
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
            title: this.translate("widgets.TrueFalseContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.TrueFalseContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("TrueFalseContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any) {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}