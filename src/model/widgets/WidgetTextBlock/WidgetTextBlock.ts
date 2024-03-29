/* global $ */
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData, InputTextBlockData, TextBlockData } from "../../../types";

export default class WidgetTextBlock extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "TextBlock";
    static category = "simpleElements";
    static icon = icon;

    data: TextBlockData;

    static async create(values?: InputTextBlockData): Promise<WidgetTextBlock> {
        return new WidgetTextBlock(values);
    }

    constructor(values?: InputTextBlockData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { text: "" };
    }

    clone(): WidgetTextBlock {
        const widget = new WidgetTextBlock();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            label: "widgets." + WidgetTextBlock.widget + ".form.label",
            help: "widgets." + WidgetTextBlock.widget + ".form.help",
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TextBlock.label")
        };
    }

    getTexts() {
        return { "text": this.data.text }
    }

    preview(): string {
        return this?.data?.text?.length ? this.data.text : this.translate("widgets.TextBlock.prev");
    }

    settingsOpened(): void {
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.text = form.textblockText;
    }

    updateTexts(texts: any): void {
        this.data.text = texts.text;
    }

    validateModel(): string[] {
        if (this.data.text.length == 0)
            return ["TextBlock.text.invalid"];
        return [];
    }

    validateForm(form: any): string[] {
        if (form.textblockText.length == 0)
            return ["TextBlock.text.invalid"];
        return [];
    }
}