import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData } from "../../../types";

export default class WidgetModal extends WidgetContainerElement {

    static widget = "Modal";
    static type = "simple-container";
    static allow = ["element"];
    static category = "containers";
    static icon = icon;
    static cssClass = "widget-modal-container";

    params: { name: string, text: string, help: string }
    data: WidgetElement[]

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetModal.widget + "-" + Utils.generate_uuid(),
            text: "",
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetModal {
        return new WidgetModal(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            text: this.params.text,
            help: this.params.help
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.SchemaContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.Modal.label");
    }

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = WidgetModal.widget + "-" + this.id;
    }


    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.text = form.text;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Modal.data.empty");
        if (this.params.text.length == 0) keys.push("Modal.text.invalid");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.text.length == 0) keys.push("Modal.text.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
