import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import WidgetDragdropItem from "../WidgetDragdropItem/WidgetDragdropItem";
import { FormEditData, InputWidgetDragDropContainerData, WidgetDragDropContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetDragdropContainer extends WidgetContainerSpecificElement {

    static widget = "DragdropContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetDragDropContainerParams;
    data: WidgetDragdropItem[];

    static async create(values?: InputWidgetDragDropContainerData): Promise<WidgetDragdropContainer> {
        const dragDrop = new WidgetDragdropContainer(values);
        dragDrop.data = values?.data ? await Promise.all(values.data.map(elem => WidgetDragdropItem.create(elem))) : [];
        return dragDrop;
    }

    constructor(values?: InputWidgetDragDropContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Drag And Drop-" + this.id,
            help: ""
        };
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