/* global $ */
import RichTextEditorMixin from "../mixings/RichTextEditorElement";
import "./styles.scss";
import icon from "./icon.png";
import { WidgetImageData, WidgetImageParams } from "../../../types";
import ItemElement from "../item/item.element";

export default abstract class ImageElement extends RichTextEditorMixin(ItemElement) {

    static widget = "Image";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageParams;
    data: WidgetImageData;

    get texts() {
        return { "help": this.params.help, "name": this.params.name, "text": this.data.text, "alt": this.data.alt }
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.Image.prev")
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    set texts(texts: any) {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.text = texts.text;
        this.data.alt = texts.alt;
    }

    updateModelFromForm(form: any): void {
        this.data.text = form.text;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!this.data.text || (this.data.text.length == 0))
            keys.push("Image.text.invalid");
        if (!this.utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt))
            keys.push("common.alt.invalid")
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        if (!form.text || (form.text.length == 0))
            keys.push("Image.text.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.alt))
            keys.push("common.alt.invalid")
        return keys;
    }
}