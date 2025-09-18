import './styles.scss';
import icon from "./icon.png";
import { InputWidgetMissingwordsContainerData, WidgetInitOptions, WidgetMissingwordsContainerParams } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import MissingWordsItemElement from "../missingwords-item/missingwords-item.element";

export default class MissingWordsContainerElement extends ContainerSpecificElement {

    static widget = "MissingWords";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetMissingwordsContainerParams;
    data: MissingWordsItemElement[]

    constructor() { super(); }

    async init(values?: InputWidgetMissingwordsContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Missing Words-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Missing Words-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(MissingWordsItemElement.widget, elem, options) as Promise<MissingWordsItemElement>)) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }));
    }

    get preview(): string {
        return this.params?.name ?? this.title;
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
        if (this.data.length == 0) errors.push("MissingWords.data.empty");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}