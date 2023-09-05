import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import template from "./template.hbs";
import icon from "./icon.png";
import { FormEditData, InputWidgetTestContainerData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";

export default class WidgetTestContainer extends WidgetContainerSpecificElement {

    static widget = "Test";
    static category = "exerciseElement";
    static icon = icon;

    static async create(values?: InputWidgetTestContainerData): Promise<WidgetTestContainer> {
        const container = new WidgetTestContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetTestContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetTestContainer.widget + "-" + this.id,
            help: ""
        };
    }

    createElement(): string {
        const constructor = WidgetTestContainer;
        const children = this.data ? this.data.map((child: WidgetSpecificItemElement ) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview(),
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            children,
            cssClass: Utils.toKebabCase(constructor.name)
        });  
    }

    clone(): WidgetTestContainer {
        const widget = new WidgetTestContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetTestContainer.widget + "-" + widget.id;
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
            title: this.translate("widgets.Test.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.Test.label");
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
        if (this.data.length == 0) keys.push("Test.data.empty")
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}