import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData, InputWidgetModalData, WidgetModalParams } from "../../../types";

export default class WidgetModal extends WidgetContainerElement {

    static widget = "Modal";
    static category = "containers";
    static icon = icon;

    params: WidgetModalParams;
    data: WidgetElement[]

    static async create(values?: InputWidgetModalData): Promise<WidgetModal> {
        const container = new WidgetModal(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetModalData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetModal.widget + "-" + this.id,
            text: "",
            help: ""
        };
    }

    clone(): WidgetModal {
        const widget = new WidgetModal();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetModal.widget + "-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
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

    getTexts() {
        return { "help": this.params.help, "name": this.params.name, "text": this.params.text }
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.Modal.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.text = form.text;
        this.params.help = form.help;
    }

    updateTexts(texts: any): void {
        this.params.text = texts.text;
        this.params.help = texts.help;
        this.params.name = texts.name;
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
