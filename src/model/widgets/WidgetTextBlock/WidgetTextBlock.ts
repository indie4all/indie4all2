/* global $ */
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetTextBlock extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "TextBlock";
    static type = "element";
    static category = "simpleElements";
    static icon = icon;
    static cssClass = "widget-textblock";

    data: { style: string, text: string }

    constructor(values: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { style: "default", text: "" };
    }

    clone(): WidgetTextBlock {
        return new WidgetTextBlock(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            label: "widgets." + WidgetTextBlock.widget + ".form.label",
            help: "widgets." + WidgetTextBlock.widget + ".form.help",
            style: this.data.style
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TextBlock.label")
        };
    }

    settingsOpened(): void {
        var editorElement = $('#f-' + this.id + ' .texteditor');
        this.initTextEditor(this.data.text, editorElement);
    }

    preview(): string {
        return this?.data?.text?.length ? this.data.text : this.translate("widgets.TextBlock.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.text = this.clearAndSanitizeHtml(form.textblockText);
        this.data.style = form.style;
    }

    validateModel(): string[] {
        if (this.data.text.length == 0 || this.isEmptyText(this.data.text))
            return ["TextBlock.text.invalid"];
        return [];
    }

    validateForm(form: any): string[] {
        if (form.textblockText.length == 0 || this.isEmptyText(form.textblockText))
            return ["TextBlock.text.invalid"];
        return [];
    }
}