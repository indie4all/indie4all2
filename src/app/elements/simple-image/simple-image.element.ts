/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { WidgetSimpleImageData, WidgetSimpleImageParams } from "../../../types";
import ItemElement from "../item/item.element";

export default abstract class SimpleImageElement extends ItemElement {

    static widget = "SimpleImage";
    static category = "simpleElements";
    static icon = icon;

    data: WidgetSimpleImageData;
    params: WidgetSimpleImageParams;

    get texts() { return { "alt": this.data.alt, "name": this.params.name } }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.SimpleImage.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.aspect = form.aspect;
        this.params.align = form.align;
        this.data.alt = form.alt;
        this.data.width = form.width;
        this.data.height = form.height;
    }

    set texts(texts: any) {
        this.data.alt = texts.alt;
        this.params.name = texts.name;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt)) keys.push("common.alt.invalid")
        if (this.params.aspect === 'custom' && (!this.data.width || !this.data.height))
            keys.push("SimpleImage.image.sizeNotSet");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.alt)) keys.push("common.alt.invalid")
        if (form.aspect === 'custom' && (!form.width || !form.height))
            keys.push("SimpleImage.image.sizeNotSet");
        return keys;
    }
}