/* global $ */
import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import { FormEditData, InputWidgetTwoColumnsLayoutData, WidgetTwoColumnsLayoutParams } from '../../../types';

export default class WidgetTwoColumnsLayout extends WidgetColumnsLayout {

    static widget = "TwoColumnsLayout";
    static category = "layouts";
    static icon = icon;
    static columns = [6, 6];

    params: WidgetTwoColumnsLayoutParams;

    static async create(values?: InputWidgetTwoColumnsLayoutData): Promise<WidgetTwoColumnsLayout> {
        const columns = new WidgetTwoColumnsLayout(values);
        columns.data = values?.data ? await Promise.all(values.data.map(arr => Promise.all(arr.map(elem => ModelManager.create(elem.widget, elem))))) : [[], []];
        return columns;
    }

    constructor(values?: InputWidgetTwoColumnsLayoutData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { firstColumnWidth: "6" };
    }

    clone(): WidgetTwoColumnsLayout {
        const widget = new WidgetTwoColumnsLayout();
        widget.data = this.data.map(col => col.map(elem => elem.clone()));
        widget.params = structuredClone(this.params);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            width: this.params.firstColumnWidth
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ColumnLayout.label")
        };
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