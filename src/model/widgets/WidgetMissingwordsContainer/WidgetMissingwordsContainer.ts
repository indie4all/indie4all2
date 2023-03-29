import Utils from "../../../Utils";
import './styles.scss';
import icon from "./icon.png";
import WidgetMissingWordsItem from "../WidgetMissingwordsItem/WidgetMissingwordsItem";
import { FormEditData, InputWidgetMissingwordsContainerData, WidgetMissingwordsContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetMissingWords extends WidgetContainerSpecificElement {

    static widget = "MissingWords";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetMissingwordsContainerParams;
    data: WidgetMissingWordsItem[]

    static async create(values?: InputWidgetMissingwordsContainerData): Promise<WidgetMissingWords> {
        const container = new WidgetMissingWords(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => WidgetMissingWordsItem.create(elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetMissingwordsContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Missing Words-" + this.id,
            help: ""
        };
    }

    clone(): WidgetMissingWords {
        const widget = new WidgetMissingWords();
        widget.params = structuredClone(this.params);
        widget.params.name = "Missing Words-" + widget.id;
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
            title: this.translate("widgets.MissingWords.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.MissingWords.label");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("MissingWords.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}