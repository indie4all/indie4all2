import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetRelatedUnitsItemData, WidgetRelatedUnitsItemData, WidgetRelatedUnitsItemParams } from "../../../types";
import Utils from "../../../Utils";

export default class WidgetRelatedUnitsItem extends WidgetSpecificItemElement {

    static widget = "RelatedUnitsItem";
    static icon = icon;

    params: WidgetRelatedUnitsItemParams;
    data: WidgetRelatedUnitsItemData;

    static async create(values?: InputWidgetRelatedUnitsItemData): Promise<WidgetRelatedUnitsItem> {
        return new WidgetRelatedUnitsItem(values);
    }

    constructor(values?: InputWidgetRelatedUnitsItemData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Table Entry-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { url: "", current: false };
    }

    clone(): WidgetRelatedUnitsItem {
        const widget = new WidgetRelatedUnitsItem();
        widget.params = structuredClone(this.params);
        widget.params.name = "Table Entry-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            help: this.params ? this.params.help : '',
            url: this.data ? this.data.url : '',
            current: this.data ? this.data.current : false
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
        return this.params?.help && (this.data?.url || this.data?.current) ?
            `<p><b>${this.params.help}</b>
                <span> -> 
                ${this.data?.current ? this.translate("widgets.RelatedUnitsItem.current") : this.data.url}
                </span></p>` :
            this.translate("widgets.RelatedUnitsItem.prev");
    }

    settingsOpened(): void {
        $('#related-units-current').on('change', function () {
            const current = $(this).is(':checked');
            $('#related-units-url').prop('disabled', current).prop('required', !current);
            if (current) $('#related-units-url').val('');
        });
    }

    settingsClosed(): void {
        $('#related-units-current').off('change');
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.help = form.help;
        this.data.url = form.url;
        this.data.current = form.current;
    }

    updateTexts(texts: any): void { }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.help.length == 0) errors.push("RelatedUnitsItem.title.invalid");
        if (!this.data.current && (this.data.url.length == 0 || !Utils.isValidUrl(this.data.url)))
            errors.push("RelatedUnitsItem.url.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.help.length == 0) errors.push("RelatedUnitsItem.title.invalid");
        if (!form.current && (form.url.length == 0 || !Utils.isValidUrl(form.url)))
            errors.push("RelatedUnitsItem.url.invalid");
        return errors;
    }
}
