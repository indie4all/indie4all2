import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import WidgetTrueFalseItem from "../WidgetTrueFalseItem/WidgetTrueFalseItem";
import { FormEditData, InputWidgetTrueFalseContainer, WidgetTrueFalseContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetTrueFalseContainer extends WidgetContainerSpecificElement {

    static widget = "TrueFalseContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetTrueFalseContainerParams;
    data: WidgetTrueFalseItem[]

    static async create(values?: InputWidgetTrueFalseContainer): Promise<WidgetTrueFalseContainer> {
        const container = new WidgetTrueFalseContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => WidgetTrueFalseItem.create(elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetTrueFalseContainer) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "True false-" + this.id,
            help: ""
        };
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