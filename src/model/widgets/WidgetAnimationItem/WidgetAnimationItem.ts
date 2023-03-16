import prev from "./prev.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import icon from "./icon.png";
import { FormEditData } from "../../../types";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";

export default class WidgetAnimationItem extends WidgetSpecificItemElement {

    static widget = "AnimationItem";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-animation-item";
    static paletteHidden = true;
    data: { image: string };

    constructor(values?: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { image: "" };
    }

    clone(): WidgetAnimationItem {
        const widget = new WidgetAnimationItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            image: this.data?.image ?? ''
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.AnimationItem.label")
        };
    }

    preview(): string {
        return this.data?.image ? prev(this.data) : this.translate("widgets.AnimationItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.image = form.image;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!Utils.isIndieResource(this.data.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }
}
