/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { WidgetImageAndSoundItemData } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default abstract class ImageSoundItemElement extends SpecificItemElement {

    static widget = "ImageAndSoundItem";
    static icon = icon;

    data: WidgetImageAndSoundItemData;

    get texts() { return { "text": this.data.text, "alt": this.data.alt } }

    get preview(): string {
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

    set texts(texts: any) {
        this.data.text = texts.text;
        this.data.alt = texts.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any) {
        var errors: string[] = [];
        if (this.utils.isStringEmptyOrWhitespace(form.alt))
            errors.push("common.alt.invalid")
        return errors;
    }
}