/* global $ */
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import icon from "./icon.png";
import { WidgetImageAndTextData, WidgetImageAndTextParams } from "../../../types";
import ItemElement from "../item/item.element";

export default abstract class ImageTextElement extends RichTextEditorMixin(ItemElement) {

    static widget = "ImageAndText";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageAndTextParams;
    data: WidgetImageAndTextData;

    get texts() {
        return { "help": this.params.help, "name": this.params.name, "alt": this.data.alt, "text": this.data.text }
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.ImageAndText.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.text = form.textblockText;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    set texts(texts: any) {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.alt = texts.alt;
        this.data.text = texts.text;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ImageAndText.text.invalid");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt)) errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.textblockText.length == 0) errors.push("ImageAndText.text.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
