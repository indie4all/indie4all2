import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetDragdropItem from "../WidgetDragdropItem/WidgetDragdropItem";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetDragdropContainer extends WidgetContainerSpecificElement {

    static widget = "DragdropContainer";
    static type = "specific-element-container";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-dragdrop-container";

    static allows() { return [WidgetDragdropItem]; }

    params: { name: string, help: string }
    data: WidgetDragdropItem[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Drag And Drop-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetDragdropContainer {
        const widget = new WidgetDragdropContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Drag And Drop-" + widget.id;
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
            title: this.translate("widgets.DragdropContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.DragdropContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("DragdropContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}