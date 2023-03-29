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

    preview(): string {
        return this.data?.text ? this.data.text : this.translate("widgets.ImageAndSoundItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.text = form.text;
        this.data.alt = form.alt;
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