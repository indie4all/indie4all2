/* global $ */
import Utils from "../../../Utils";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { InputWidgetCouplesItemData, WidgetCouplesItemData } from "../../../types";

export default abstract class WidgetCouplesItem extends RichTextEditorMixin(WidgetSpecificItemElement) {

    static widget = "CouplesItem";
    static icon = icon;

    data: WidgetCouplesItemData;

    static async create(values?: InputWidgetCouplesItemData): Promise<WidgetCouplesItem> { return null; }

    abstract clone(): WidgetCouplesItem;

    getTexts() {
        return {
            "couples": [
                { "text": this.data.couples[0].text, "alt": this.data.couples[0].alt },
                { "text": this.data.couples[1].text, "alt": this.data.couples[1].alt }
            ]
        }
    }

    preview(): string {
        const couples = this.data.couples.filter(couple => ["image", "text"].includes(couple.type));
        return couples.length === 2 ?
            couples.map(couple => couple.type === "image" ? `<div>${couple.alt}</div>` : `<div>${couple.text}</div>`).join(' -> ') :
            this.translate("widgets.CouplesItem.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.couples[0].type = form.couple[0].type;
        this.data.couples[1].type = form.couple[1].type;
        this.data.couples[0].text = form.couple[0].text;
        this.data.couples[1].text = form.couple[1].text;
        this.data.couples[0].alt = form.couple[0].alt;
        this.data.couples[1].alt = form.couple[1].alt;
    }

    updateTexts(texts: any): void {
        const couples = texts.couples as any[];
        [0, 1].forEach(idx => {
            this.data.couples[idx].text = couples[idx].text;
            this.data.couples[idx].alt = couples[idx].alt;
        });
    }

    validateModel(): string[] {

        var errors: string[] = [];
        this.data.couples.forEach(couple => {
            if (couple.type !== 'text' && couple.type !== 'image')
                errors.push("CouplesItem.type.invalid");
            if (couple.type === 'text' && Utils.isStringEmptyOrWhitespace(couple.text))
                errors.push("CouplesItem.text.invalid");
            if (couple.type === 'image' && Utils.isStringEmptyOrWhitespace(couple.alt))
                errors.push("common.alt.invalid")
        });
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        form.couple.forEach(couple => {
            if (couple.type !== 'text' && couple.type !== 'image')
                errors.push("CouplesItem.type.invalid");
            if (couple.type === 'text' && Utils.isStringEmptyOrWhitespace(couple.text))
                errors.push("CouplesItem.text.invalid");
            if (couple.type === 'image' && Utils.isStringEmptyOrWhitespace(couple.alt))
                errors.push("common.alt.invalid")
        });
        return errors;
    }

}
