import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetCorrectWordContainerData, WidgetCorrectWordContainerParams, WidgetInitOptions } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import CorrectWordItemElement from "../correct-word-item/correct-word-item.element";

export default class CorrectWordContainerElement extends ContainerSpecificElement {

    static widget = "CorrectWord";
    static category = "interactiveElements";
    static icon = icon;

    data: CorrectWordItemElement[]
    params: WidgetCorrectWordContainerParams;

    constructor() { super(); }

    async init(values?: InputWidgetCorrectWordContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Correct word-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Correct word-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) as CorrectWordItemElement[] : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview() { return this.params?.name ?? this.translate("widgets.CorrectWord.label"); }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("CorrectWord.data.empty");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}
