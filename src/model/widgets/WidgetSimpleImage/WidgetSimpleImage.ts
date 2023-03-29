/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { InputWidgetSimpleImageData, WidgetSimpleImageData, WidgetSimpleImageParams } from "../../../types";

export default abstract class WidgetSimpleImage extends WidgetItemElement {

    static widget = "SimpleImage";
    static category = "simpleElements";
    static icon = icon;

    data: WidgetSimpleImageData;
    params: WidgetSimpleImageParams;

    static async create(values?: InputWidgetSimpleImageData): Promise<WidgetSimpleImage> { return null; }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.SimpleImage.prev");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.aspect = form.aspect;
        this.params.align = form.align;
        this.data.alt = form.alt;
        this.data.width = form.width;
        this.data.height = form.height;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) keys.push("common.alt.invalid")
        if (this.params.aspect === 'custom' && (!this.data.width || !this.data.height))
            keys.push("SimpleImage.image.sizeNotSet");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) keys.push("common.alt.invalid")
        if (form.aspect === 'custom' && (!form.width || !form.height))
            keys.push("SimpleImage.image.sizeNotSet");
        return keys;
    }
}