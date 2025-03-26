/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { WidgetButtonTextItemData } from "../../../types";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import SpecificItemElement from "../specific-item/specific-item.element";

export default abstract class ButtonTextItemElement extends RichTextEditorMixin(SpecificItemElement) {

    static widget = "ButtonTextItem";
    static icon = icon;
    data: WidgetButtonTextItemData;

    get texts() { return { "text": this.data.text, "alt": this.data.alt }; }

    get preview() { return this.data?.alt ? this.data.alt : this.translate("widgets.ButtonTextItem.prev"); }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.text = form.text;
        this.data.alt = form.alt;
    }

    set texts(texts: any) {
        this.data.text = texts.text;
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }

}