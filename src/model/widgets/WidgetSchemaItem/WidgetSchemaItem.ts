/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { InputWidgetSchemaItemData, WidgetSchemaItemData } from "../../../types";

export default abstract class WidgetSchemaItem extends WidgetSpecificItemElement {

    static widget = "SchemaItem";
    static icon = icon;

    data: WidgetSchemaItemData;

    static async create(values?: InputWidgetSchemaItemData): Promise<WidgetSchemaItem> { return null; }

    constructor(values?: InputWidgetSchemaItemData) {
        super(values);
    }

    getTexts() {
        return { "alt": this.data.alt }
    }

    preview(): string {
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

    updateTexts(texts: any): void {
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            errors.push("common.alt.invalid")
        return errors;
    }
}