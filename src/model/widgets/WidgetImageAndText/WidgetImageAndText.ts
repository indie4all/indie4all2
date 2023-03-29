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

    preview(): string {
        return this.params?.name ?? this.translate("widgets.ImageAndText.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.text = this.clearAndSanitizeHtml(form.textblockText);
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
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
