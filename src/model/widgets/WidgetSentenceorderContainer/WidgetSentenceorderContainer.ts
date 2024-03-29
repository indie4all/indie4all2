import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import WidgetSentenceOrderItem from "../WidgetSentenceorderItem/WidgetSentenceorderItem";
import { FormEditData, InputWidgetSentenceorderContainerData, WidgetSentenceorderContainerParms } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetSentenceOrderContainer extends WidgetContainerSpecificElement {

    static widget = "SentenceOrderContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetSentenceorderContainerParms;
    data: WidgetSentenceOrderItem[];

    static async create(values?: InputWidgetSentenceorderContainerData): Promise<WidgetSentenceOrderContainer> {
        const container = new WidgetSentenceOrderContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => WidgetSentenceOrderItem.create(elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetSentenceorderContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Sentence Order-" + this.id,
            help: ""
        };
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