import prev from "./prev.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import icon from "./icon.png";
import { FormEditData, InputWidgetAnimationItemData, WidgetAnimationItemData } from "../../../types";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";

export default class WidgetAnimationItem extends WidgetSpecificItemElement {

    static widget = "AnimationItem";
    static icon = icon;
    data: WidgetAnimationItemData;

    static async create(values?: InputWidgetAnimationItemData): Promise<WidgetAnimationItem> {
        return new WidgetAnimationItem(values);
    }

    constructor(values?: InputWidgetAnimationItemData) {
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

    getTexts() {
        return {};
    }

    preview(): string {
        return this.data?.image ? prev(this.data) : this.translate("widgets.AnimationItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.image = form.image;
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateTexts(texts: any): void { }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!Utils.isValidResource(this.data.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (!Utils.isValidResource(form.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }
}
