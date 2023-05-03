/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { InputWidgetButtonTextItemData, WidgetButtonTextItemData } from "../../../types";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";

export default abstract class WidgetButtonTextItem extends RichTextEditorMixin(WidgetSpecificItemElement) {

    static widget = "ButtonTextItem";
    static icon = icon;
    data: WidgetButtonTextItemData;

    static async create(values?: InputWidgetButtonTextItemData): Promise<WidgetButtonTextItem> { return null; }

    abstract clone(): WidgetButtonTextItem;

    getTexts() {
        return { "text": this.data.text, "alt": this.data.alt };
    }

    preview(): string {
        return this.data?.alt ? this.data.alt : this.translate("widgets.ButtonTextItem.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.text = this.clearAndSanitizeHtml(form.text);
        this.data.alt = form.alt;
    }

    updateTexts(texts: any): void {
        this.data.text = texts.text;
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(this.data.text)) errors.push("TextBlock.text.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.isEmptyText(form.text)) errors.push("TextBlock.text.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }

}