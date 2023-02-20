import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import ModelManager from '../../ModelManager';
import icon from "./icon.png";
import WidgetElement from '../WidgetElement/WidgetElement';
import { FormEditData } from '../../../types';

export default class WidgetFourColumnsLayout extends WidgetColumnsLayout {

    static widget = "FourColumnsLayout";
    static type = "layout";
    static allow = ["element", "specific-element-container"];
    static category = "layouts";
    static editable = false;
    static icon = icon;
    static columns = [3, 3, 3, 3];

    data: WidgetElement[][]

    constructor(values: any) {
        super(values);
        this.data = values?.data ?
            values.data.map((arr: any[]) => arr.map(elem => ModelManager.create(elem.widget, elem))) : [[], [], [], []];
    }

    clone(): WidgetFourColumnsLayout {
        return new WidgetFourColumnsLayout(this);
    }

    getInputs(): Promise<FormEditData> {
        throw new Error('Method not implemented.');
    }

    updateModelFromForm(form: any): void {
        throw new Error('Method not implemented.');
    }
}