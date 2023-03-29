import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { BlockquoteData, FormEditData, InputBlockquoteData } from "../../../types";

export default class WidgetBlockquote extends WidgetItemElement {

    static widget = "Blockquote";
    static category = "simpleElements";
    static icon = icon;
    data: BlockquoteData;

    static async create(values?: InputBlockquoteData): Promise<WidgetBlockquote> {
        return new WidgetBlockquote(values);
    }

    constructor(values?: InputBlockquoteData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { quote: "", caption: "", alignment: "", source: "" };
    }

    clone(): WidgetBlockquote {
        const widget = new WidgetBlockquote();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        return {
            inputs: form({
                instanceId: this.id,
                caption: this.data.caption,
                quote: this.data.quote,
                alignment: this.data.alignment,
                source: this.data.source
            }),
            title: this.translate("widgets.Blockquote.label")
        };
    }

    preview(): string {
        return this.data?.quote ? this.data.quote : this.translate("widgets.Blockquote.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.quote = form.quote;
        this.data.caption = form.caption;
        this.data.alignment = form.alignment;
        this.data.source = form.source;
    }

    validateModel(): string[] {
        const errors: string[] = [];
        if (this.data.quote.length == 0)
            errors.push("Blockquote.quote.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        if (form.quote.length == 0)
            return ["Blockquote.quote.invalid"];
        return [];
    }
}