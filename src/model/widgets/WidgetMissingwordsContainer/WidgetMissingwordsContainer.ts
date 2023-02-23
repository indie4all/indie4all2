import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetMissingWordsItem from "../WidgetMissingwordsItem/WidgetMissingwordsItem";
import { FormEditData } from "../../../types";

export default class WidgetMissingWords extends WidgetContainerElement {

    static widget = "MissingWords";
    static type = "specific-element-container";
    static allow = ["MissingWordsItem"];
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-missing-words";

    params: { name: string, help: string }
    data: WidgetMissingWordsItem[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Missing Words-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
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