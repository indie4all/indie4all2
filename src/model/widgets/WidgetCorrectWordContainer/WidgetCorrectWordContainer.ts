import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetCorrectWordItem from "../WidgetCorrectWordItem/WidgetCorrectWordItem";
import { FormEditData, InputWidgetCorrectWordContainerData, WidgetCorrectWordContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetCorrectWordContainer extends WidgetContainerSpecificElement {

    static widget = "CorrectWord";
    static category = "interactiveElements";
    static icon = icon;

    data: WidgetCorrectWordItem[]
    params: WidgetCorrectWordContainerParams;

    static async create(values?: InputWidgetCorrectWordContainerData): Promise<WidgetCorrectWordContainer> {
        const container = new WidgetCorrectWordContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map((elem: any) => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetCorrectWordContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Correct word-" + this.id,
            help: ""
        };
    }

    clone(): WidgetCorrectWordContainer {
        const widget = new WidgetCorrectWordContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Correct word-" + widget.id;
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
            title: this.translate("widgets.CorrectWord.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.CorrectWord.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("CorrectWord.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}
