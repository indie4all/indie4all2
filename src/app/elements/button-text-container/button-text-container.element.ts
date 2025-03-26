import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetButtonTextContainerData, WidgetInitOptions } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import ButtonTextItemElement from "../button-text-item/button-text-item.element";

export default class ButtonTextContainerElement extends ContainerSpecificElement {

    static widget = "ButtonTextContainer";
    static category = "interactiveElements";
    static icon = icon;

    data: ButtonTextItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetButtonTextContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Buttons with text-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Buttons with text-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) as ButtonTextItemElement[] : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview() { return this.params?.name ?? this.translate("widgets.ButtonTextContainer.label"); }

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
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("ButtonTextContainer.data.empty");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
