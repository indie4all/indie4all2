/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { WidgetCorrectWordItemData } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default abstract class CorrectWordItemElement extends SpecificItemElement {

    static widget = "CorrectWordItem";
    static icon = icon;
    data: WidgetCorrectWordItemData

    get texts() {
        return {
            "question": this.data.question,
            "word": this.data.word,
            "alt": this.data.alt
        }
    }

    get preview() {
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

    set texts(texts: any) {
        this.data.question = texts.question;
        this.data.word = texts.word;
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.utils.isStringEmptyOrWhitespace(this.data.question))
            errors.push("CorrectWordItem.question.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.word))
            errors.push("CorrectWordItem.word.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (this.utils.isStringEmptyOrWhitespace(form.question)) errors.push("formData.question.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.word)) errors.push("formData.word.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid");
        return errors;
    }
}