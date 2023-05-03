import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import ModelManager from '../../ModelManager';
import icon from "./icon.png";
import { FormEditData, InputWidgetFourColumnsLayoutData } from '../../../types';

export default class WidgetFourColumnsLayout extends WidgetColumnsLayout {

    static widget = "FourColumnsLayout";
    static category = "layouts";
    static editable = false;
    static icon = icon;
    static columns = [3, 3, 3, 3];

    static async create(values?: InputWidgetFourColumnsLayoutData): Promise<WidgetFourColumnsLayout> {
        const columns = new WidgetFourColumnsLayout(values);
        columns.data = values?.data ? await Promise.all(values.data.map(arr => Promise.all(arr.map(elem => ModelManager.create(elem.widget, elem))))) : [[], [], [], []];
        return columns;
    }

    constructor(values?: InputWidgetFourColumnsLayoutData) {
        super(values);
    }

    clone(): WidgetFourColumnsLayout {
        const widget = new WidgetFourColumnsLayout();
        widget.data = this.data.map(col => col.map(elem => elem.clone()));
        return widget;
    }

    getInputs(): Promise<FormEditData> {
        throw new Error('Method not implemented.');
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = this.data.map(col => col.map(elem => elem.toJSON()));
        return result;
    }

    updateModelFromForm(form: any): void {
        throw new Error('Method not implemented.');
    }
}