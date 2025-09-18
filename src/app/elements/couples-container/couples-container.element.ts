import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetCouplesContainerData, WidgetCouplesContainerParams, WidgetInitOptions } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import CouplesItemElement from "../couples-item/couples-item.element";

export default class CouplesContainerElement extends ContainerSpecificElement {

    static widget = "CouplesContainer";
    static category = "interactiveElements";
    static icon = icon;

    data: CouplesItemElement[]
    params: WidgetCouplesContainerParams;

    constructor() { super(); }

    async init(values?: InputWidgetCouplesContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Couples-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Couples-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) as CouplesItemElement[] : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview() { return this.params?.name ?? this.translate("widgets.CouplesContainer.label"); }

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
        if (this.data.length == 0) errors.push("CouplesContainer.data.empty");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
