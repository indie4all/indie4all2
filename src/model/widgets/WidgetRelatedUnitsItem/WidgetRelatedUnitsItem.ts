import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetRelatedUnitsItemData, WidgetRelatedUnitsItemData } from "../../../types";

export default class WidgetRelatedUnitsItem extends WidgetSpecificItemElement {

    static widget = "RelatedUnitsItem";
    static icon = icon;

    data: WidgetRelatedUnitsItemData;

    static async create(values?: InputWidgetRelatedUnitsItemData): Promise<WidgetRelatedUnitsItem> {
        return new WidgetRelatedUnitsItem(values);
    }

    constructor(values?: InputWidgetRelatedUnitsItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { title: "", url: "" };
    }

    clone(): WidgetRelatedUnitsItem {
        const widget = new WidgetRelatedUnitsItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            title: this.data ? this.data.title : '',
            url: this.data ? this.data.url : ''
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.RelatedUnitsItem.label")
        };
    }

    getTexts() {
        return {};
    }

    preview(): string {
        return this.data?.title && this.data?.url ?
            `<p><b>${this.data.title}</b><span> -> ${this.data.url}</span></p>` :
            this.translate("widgets.RelatedUnitsItem.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.title = form.title;
        this.data.url = form.url;
    }

    updateTexts(texts: any): void { }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.title.length == 0) errors.push("RelatedUnitsItem.title.invalid");
        if (this.data.url.length == 0) errors.push("RelatedUnitsItem.url.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.title.length == 0) errors.push("RelatedUnitsItem.title.invalid");
        if (form.url.length == 0) errors.push("RelatedUnitsItem.url.invalid");
        return errors;
    }
}
