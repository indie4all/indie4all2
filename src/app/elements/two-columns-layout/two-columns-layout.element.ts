/* global $ */
import './styles.scss';
import icon from "./icon.png";
import { InputWidgetTwoColumnsLayoutData, WidgetInitOptions, WidgetTwoColumnsLayoutParams } from '../../../types';
import ColumnsLayoutElement from '../columns-layout/columns-layout.element';

export default class TwoColumnsLayoutElement extends ColumnsLayoutElement {

    static widget = "TwoColumnsLayout";
    static category = "layouts";
    static icon = icon;
    static columns = [6, 6];

    params: WidgetTwoColumnsLayoutParams;

    constructor() { super(); }

    async init(values?: InputWidgetTwoColumnsLayoutData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : { firstColumnWidth: "6" };
        this.data = values?.data ? await Promise.all(values.data.map(arr => Promise.all(arr.map(elem => this.create(elem.widget, elem, options))))) : [[], []];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            width: this.params.firstColumnWidth
        }));
    }

    settingsClosed(): void {
        const width = <number>$('#column-layout-width-1').val();
        const $container = $(`[data-id="${this.id}"]`).find('.row');
        const $firstColumn = $container.children().eq(0);
        const $secondColumn = $container.children().eq(1);
        $firstColumn.removeClass().addClass(`col-md-${width}`);
        $secondColumn.removeClass().addClass(`col-md-${12 - width}`);
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = this.data.map(col => col.map(elem => elem.toJSON()));
        if (this.params) result["params"] = structuredClone(this.params);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.firstColumnWidth = form.width;
    }

    validateModel(): string[] {
        const errors: string[] = [];
        const emptyElement = this.data.find(elem => elem.length == 0);
        if (emptyElement) errors.push("ColumnLayout.data.empty");
        const width = this.params?.firstColumnWidth;
        if (!/^\d{1,2}$/.test(width) || parseInt(width) < 1 || parseInt(width) > 11)
            errors.push("ColumnLayout.width.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        if (!/^\d{1,2}$/.test(form.width) || parseInt(form.width) < 1 || parseInt(form.width) > 11)
            return ["ColumnLayout.width.invalid"]
        return [];
    }
}