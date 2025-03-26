import "./styles.scss";
import template from "./template.hbs";
import icon from "./icon.png";
import { InputWidgetTestContainerData, WidgetInitOptions } from "../../../types";
import Config from "../../../config";
import ContainerSpecificElement from "../container-specific/container-specific.element";

export default class TestContainerElement extends ContainerSpecificElement {

    protected static _generable: boolean = false;
    static widget = "Test";
    static category = "exerciseElement";
    static icon = icon;

    constructor() { super(); }

    async init(values?: InputWidgetTestContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: TestContainerElement.widget + "-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = TestContainerElement.widget + "-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    createElement(): string {
        const constructor = TestContainerElement;
        const children = this.data ? this.data.map((child: ContainerSpecificElement) => child.createElement()).join('') : "";
        return template({
            id: this.id,
            widget: constructor.widget,
            icon: constructor.icon,
            label: this.preview,
            canAdd: constructor.addable,
            canEdit: constructor.editable,
            canDelete: constructor.deletable,
            canCopy: constructor.copyable,
            canLoadFromBank: !!Config.getBankOfWidgetsURL(),
            children,
            cssClass: this.utils.toKebabCase(constructor.name)
        });
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }));
    }

    get preview(): string {
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
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}