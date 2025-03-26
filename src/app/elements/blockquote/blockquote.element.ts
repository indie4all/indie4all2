import "./styles.scss";
import icon from "./icon.png";
import { BlockquoteData, InputBlockquoteData, WidgetInitOptions } from "../../../types";
import ItemElement from "../item/item.element";

export default class BlockquoteElement extends ItemElement {

    static widget = "Blockquote";
    static category = "simpleElements";
    static icon = icon;
    data: BlockquoteData;

    constructor() { super(); }

    async init(values?: InputBlockquoteData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { quote: "", caption: "", alignment: "", source: "" };
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                caption: this.data.caption,
                quote: this.data.quote,
                alignment: this.data.alignment,
                source: this.data.source
            }));
    }

    get preview() { return this.data?.quote ? this.data.quote : this.translate("widgets.Blockquote.prev"); }

    get texts() { return { quote: this.data.quote } }

    updateModelFromForm(form: any): void {
        this.data.quote = form.quote;
        this.data.caption = form.caption;
        this.data.alignment = form.alignment;
        this.data.source = form.source;
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    set texts(texts: any) {
        this.data.quote = texts.quote;
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