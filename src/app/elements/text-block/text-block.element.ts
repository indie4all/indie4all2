/* global $ */
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import icon from "./icon.png";
import { InputTextBlockData, TextBlockData, WidgetInitOptions } from "../../../types";
import ItemElement from "../item/item.element";

export default class TextBlockElement extends RichTextEditorMixin(ItemElement) {

    static widget = "TextBlock";
    static category = "simpleElements";
    static icon = icon;

    data: TextBlockData;

    constructor() { super(); }

    async init(values?: InputTextBlockData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { text: "" };
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            label: "widgets." + TextBlockElement.widget + ".form.label",
            help: "widgets." + TextBlockElement.widget + ".form.help",
        }));
    }

    get texts() {
        return { "text": this.data.text }
    }

    get preview(): string {
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

    set texts(texts: any) { this.data.text = texts.text; }

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