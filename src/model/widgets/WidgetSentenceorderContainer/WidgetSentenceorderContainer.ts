import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetSentenceOrderItem from "../WidgetSentenceorderItem/WidgetSentenceorderItem";
import { FormEditData } from "../../../types";

export default class WidgetSentenceOrderContainer extends WidgetContainerElement {

    static widget = "SentenceOrderContainer";
    static type = "specific-element-container";
    static allow = ["SentenceOrderItem"];
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-sentence-order";

    params: { name: string, help: string }
    data: WidgetSentenceOrderItem[]

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Sentence Order-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetSentenceOrderContainer {
        return new WidgetSentenceOrderContainer(this);
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

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = "Sentence Order-" + this.id;
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