/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { WidgetSchemaItemData } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default abstract class SchemaItemElement extends SpecificItemElement {

    static widget = "SchemaItem";
    static icon = icon;

    data: WidgetSchemaItemData;

    constructor() { super(); }

    get texts() { return { "alt": this.data.alt } }

    get preview(): string {
        return this.data?.alt ? this.data.alt : this.translate("widgets.SchemaItem.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.alt = form.alt;
    }

    set texts(texts: any) { this.data.alt = texts.alt; }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (this.utils.isStringEmptyOrWhitespace(form.alt))
            errors.push("common.alt.invalid")
        return errors;
    }
}