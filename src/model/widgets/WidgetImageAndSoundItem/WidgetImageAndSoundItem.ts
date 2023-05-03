/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { InputWidgetImageAndSoundItemData, WidgetImageAndSoundItemData } from "../../../types";

export default abstract class WidgetImageAndSoundItem extends WidgetSpecificItemElement {

    static widget = "ImageAndSoundItem";
    static icon = icon;

    data: WidgetImageAndSoundItemData;

    static async create(values?: InputWidgetImageAndSoundItemData): Promise<WidgetImageAndSoundItem> { return null; }

    getTexts() {
        return { "text": this.data.text, "alt": this.data.alt }
    }

    preview(): string {
        return this.data?.text ? this.data.text : this.translate("widgets.ImageAndSoundItem.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.text = form.text;
        this.data.alt = form.alt;
    }

    updateTexts(texts: any): void {
        this.data.text = texts.text;
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any) {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            errors.push("common.alt.invalid")
        return errors;
    }
}