import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetRelatedUnitsItemData, WidgetInitOptions, WidgetRelatedUnitsItemData, WidgetRelatedUnitsItemParams } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default class RelatedUnitsItemElement extends SpecificItemElement {

    static widget = "RelatedUnitsItem";
    static icon = icon;

    params: WidgetRelatedUnitsItemParams;
    data: WidgetRelatedUnitsItemData;

    constructor() { super(); }

    async init(values?: InputWidgetRelatedUnitsItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Table Entry-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Table Entry-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : { url: "", current: false };
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            help: this.params.help ? this.params.help : '',
            url: this.data.url ? this.data.url : '',
            current: this.data.current
        }));
    }

    get texts() { return {}; }

    get preview(): string {
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

    set texts(texts: any) { }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.help.length == 0) errors.push("RelatedUnitsItem.title.invalid");
        if (!this.data.current && (this.data.url.length == 0 || !this.utils.isValidUrl(this.data.url)))
            errors.push("RelatedUnitsItem.url.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.help.length == 0) errors.push("RelatedUnitsItem.title.invalid");
        if (!form.current && (form.url.length == 0 || !this.utils.isValidUrl(form.url)))
            errors.push("RelatedUnitsItem.url.invalid");
        return errors;
    }
}
