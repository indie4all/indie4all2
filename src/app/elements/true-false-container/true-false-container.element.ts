import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetTrueFalseContainer, WidgetInitOptions, WidgetTrueFalseContainerParams } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import TrueFalseItemElement from "../true-false-item/true-false-item.element";

export default class TrueFalseContainerElement extends ContainerSpecificElement {

    static widget = "TrueFalseContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetTrueFalseContainerParams;
    data: TrueFalseItemElement[]

    constructor() { super(); }

    async init(values?: InputWidgetTrueFalseContainer, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "True false-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "True false-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(TrueFalseItemElement.widget, elem, options) as Promise<TrueFalseItemElement>)) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }));
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.TrueFalseContainer.label");
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
        if (this.data.length == 0) keys.push("TrueFalseContainer.data.empty");
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any) {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}