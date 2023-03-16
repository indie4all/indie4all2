import Utils from "../../../Utils"
import './styles.scss';
import ModelManager from '../../ModelManager';
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData } from "../../../types";
import WidgetSpecificContainerElement from "../WidgetSpecificContainerElement/WidgetSpecificContainerElement";

export default class WidgetAcordionContainer extends WidgetSpecificContainerElement {

    static widget = "AcordionContainer";
    static category = "containers";
    static icon = icon;

    params: { name: string, help: string };
    data!: WidgetElement[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Acordion-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetAcordionContainer {
        const widget = new WidgetAcordionContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Acordion-" + widget.id;
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
            title: this.translate("widgets.AcordionContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.AcordionContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0)
            keys.push("AcordionContainer.data.empty");
        if (!Utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }
}
