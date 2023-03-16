import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetSentenceOrderItem from "../WidgetSentenceorderItem/WidgetSentenceorderItem";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetSentenceOrderContainer extends WidgetContainerSpecificElement {

    static widget = "SentenceOrderContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: { name: string, help: string }
    data: WidgetSentenceOrderItem[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Sentence Order-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetSentenceOrderContainer {
        const widget = new WidgetSentenceOrderContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Sentence Order-" + widget.id;
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
            title: this.translate("widgets.SentenceOrderContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.SentenceOrderContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("SentenceOrderContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}