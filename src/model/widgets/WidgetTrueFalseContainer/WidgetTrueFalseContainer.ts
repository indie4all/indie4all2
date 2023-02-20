import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetTrueFalseItem from "../WidgetTrueFalseItem/WidgetTrueFalseItem";
import { FormEditData } from "../../../types";

export default class WidgetTrueFalseContainer extends WidgetContainerElement {

    static widget = "TrueFalseContainer";
    static type = "specific-element-container";
    static allow = ["TrueFalseItem"];
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-true-false";

    params: { name: string, help: string }
    data: WidgetTrueFalseItem[]

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "True false-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetTrueFalseContainer {
        return new WidgetTrueFalseContainer(this);
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

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = "True false-" + this.id;
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