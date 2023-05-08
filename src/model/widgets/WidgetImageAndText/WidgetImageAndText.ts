/* global $ */
import Utils from "../../../Utils";
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { InputWidgetImageAndTextData, WidgetImageAndTextData, WidgetImageAndTextParams } from "../../../types";

export default abstract class WidgetImageAndText extends RichTextEditorMixin(WidgetItemElement) {

    static widget = "ImageAndText";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageAndTextParams;
    data: WidgetImageAndTextData;

    static async create(values?: InputWidgetImageAndTextData): Promise<WidgetImageAndText> { return null; }

    getTexts() {
        return { "help": this.params.help, "name": this.params.name, "alt": this.data.alt, "text": this.data.text }
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.ImageAndText.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.text = this.clearAndSanitizeHtml(form.textblockText);
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    updateTexts(texts: any): void {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.alt = texts.alt;
        this.data.text = texts.text;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(this.data.text)) errors.push("ImageAndText.text.invalid");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.textblockText.length == 0) errors.push("ImageAndText.text.invalid");
        if (this.isEmptyText(form.textblockText)) errors.push("TextBlock.text.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
