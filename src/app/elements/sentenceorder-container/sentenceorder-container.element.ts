import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetSentenceorderContainerData, WidgetInitOptions, WidgetSentenceorderContainerParms } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import SentenceOrderItemElement from "../sentenceorder-item/sentenceorder-item.element";

export default class SentenceOrderContainerElement extends ContainerSpecificElement {

    static widget = "SentenceOrderContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetSentenceorderContainerParms;
    data: SentenceOrderItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetSentenceorderContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Sentence Order-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Sentence Order-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(SentenceOrderItemElement.widget, elem, options) as Promise<SentenceOrderItemElement>
        )) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }));
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.SentenceOrderContainer.label");
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
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("SentenceOrderContainer.data.empty");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}