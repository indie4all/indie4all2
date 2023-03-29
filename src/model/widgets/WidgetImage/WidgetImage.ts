/* global $ */
import Utils from "../../../Utils";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { InputWidgetImageData, WidgetImageData, WidgetImageParams } from "../../../types";

export default abstract class WidgetImage extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "Image";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageParams;
    data: WidgetImageData;

    static async create(values?: InputWidgetImageData): Promise<WidgetImage> { return null; }
    preview(): string {
        return this.params?.name ?? this.translate("widgets.Image.prev")
    }

    updateModelFromForm(form: any): void {
        this.data.text = this.clearAndSanitizeHtml(form.text);
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!this.data.text || (this.data.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(this.data.text))
            keys.push("TextBlock.text.invalid");
        if (!Utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            keys.push("common.alt.invalid")
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        if (!form.text || (form.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.isEmptyText(form.text))
            keys.push("TextBlock.text.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt))
            keys.push("common.alt.invalid")
        return keys;
    }
}