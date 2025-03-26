import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetDragDropContainerData, WidgetDragDropContainerParams, WidgetInitOptions } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import DragdropItemElement from "../dragdrop-item/dragdrop-item.element";

export default class DragdropContainerElement extends ContainerSpecificElement {

    static widget = "DragdropContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetDragDropContainerParams;
    data: DragdropItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetDragDropContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Drag And Drop-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Drag And Drop-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(DragdropItemElement.widget, elem, options) as Promise<DragdropItemElement>
        )) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview() { return this.params?.name ?? this.translate("widgets.DragdropContainer.label"); }

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
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}