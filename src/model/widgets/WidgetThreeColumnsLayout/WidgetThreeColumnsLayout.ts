import ModelManager from "../../ModelManager";
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import './styles.scss';
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetThreeColumnsLayout extends WidgetColumnsLayout {

    static widget = "ThreeColumnsLayout";
    static type = "layout";
    static allow = ["element", "specific-element-container"];
    static category = "layouts";
    static editable = false;
    static icon = icon;
    static columns = [4, 4, 4];

    constructor(values: any) {
        super(values);
        this.data = values?.data ? values.data.map((arr: any[]) => arr.map(elem => ModelManager.create(elem.widget, elem))) : [[], [], []];
    }

    clone(): WidgetThreeColumnsLayout {
        return new WidgetThreeColumnsLayout(this);
    }

    getInputs(): Promise<FormEditData> {
        throw new Error("Method not implemented.");
    }

    updateModelFromForm(form: any): void {
        throw new Error("Method not implemented.");
    }
}