import ModelManager from "../../ModelManager";
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import './styles.scss';
import icon from "./icon.png";
import { FormEditData, InputWidgetThreeColumnsLayoutData } from "../../../types";

export default class WidgetThreeColumnsLayout extends WidgetColumnsLayout {

    static widget = "ThreeColumnsLayout";
    static category = "layouts";
    static editable = false;
    static icon = icon;
    static columns = [4, 4, 4];

    static async create(values?: InputWidgetThreeColumnsLayoutData): Promise<WidgetThreeColumnsLayout> {
        const columns = new WidgetThreeColumnsLayout(values);
        columns.data = values?.data ? await Promise.all(values.data.map(arr => Promise.all(arr.map(elem => ModelManager.create(elem.widget, elem))))) : [[], [], []];
        return columns;
    }

    constructor(values?: InputWidgetThreeColumnsLayoutData) {
        super(values);
    }

    clone(): WidgetThreeColumnsLayout {
        const widget = new WidgetThreeColumnsLayout();
        widget.data = this.data.map(col => col.map(elem => elem.clone()));
        return widget;
    }

    getInputs(): Promise<FormEditData> {
        throw new Error("Method not implemented.");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = this.data.map(col => col.map(elem => elem.toJSON()));
        return result;
    }

    updateModelFromForm(form: any): void {
        throw new Error("Method not implemented.");
    }
}