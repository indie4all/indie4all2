/* global $ */
import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import { FormEditData } from '../../../types';
import WidgetItemElement from '../WidgetItemElement/WidgetItemElement';
import WidgetContainerSpecificElement from '../WidgetContainerSpecificElement/WidgetContainerSpecificElement';

export default class WidgetTwoColumnsLayout extends WidgetColumnsLayout {

    static widget = "TwoColumnsLayout";
    static type = "layout";
    static category = "layouts";
    static icon = icon;
    static columns = [6, 6];

    static allows() { return [WidgetItemElement, WidgetContainerSpecificElement]; }

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { firstColumnWidth: 6 };
        this.data = values?.data ? values.data.map((arr: any[]) => arr.map(elem => ModelManager.create(elem.widget, elem))) : [[], []];
    }

    clone(): WidgetTwoColumnsLayout {
        const widget = new WidgetTwoColumnsLayout();
        widget.data = this.data.map(col => col.map(elem => elem.clone()));
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