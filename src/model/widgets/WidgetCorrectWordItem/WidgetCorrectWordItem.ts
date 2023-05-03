/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { InputWidgetCorrectWordItemData, WidgetCorrectWordItemData } from "../../../types";

export default abstract class WidgetCorrectWordItem extends WidgetSpecificItemElement {

    static widget = "CorrectWordItem";
    static icon = icon;
    data: WidgetCorrectWordItemData

    static async create(values?: InputWidgetCorrectWordItemData): Promise<WidgetCorrectWordItem> { return null; }

    getTexts() {
        return {
            "question": this.data.question,
            "word": this.data.word,
            "alt": this.data.alt
        }
    }

    preview(): string {
        return (this.data?.question && this.data?.word) ?
            (this.data.question + " -> " + this.data.word) : this.translate("widgets.CorrectWordItem.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.question = form.question;
        this.data.word = form.word;
        this.data.alt = form.alt;
    }

    updateTexts(texts: any): void {
        this.data.question = texts.question;
        this.data.word = texts.word;
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(this.data.question))
            errors.push("CorrectWordItem.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.word))
            errors.push("CorrectWordItem.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(form.question)) errors.push("formData.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.word)) errors.push("formData.word.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid");
        return errors;
    }
}