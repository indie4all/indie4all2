import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import ModelManager from '../../ModelManager';
import icon from "./icon.png";

export default class WidgetFourColumnsLayout extends WidgetColumnsLayout {

    static widget = "FourColumnsLayout";
    static type = "layout";
    static allow = ["element", "specific-element-container"];
    static category = "layouts";
    static toolbar = { edit: false };
    static icon = icon;
    static columns = [3,3,3,3];

    constructor(values) {
        super(values);
        this.data = values?.data ? 
            values.data.map(arr => arr.map(elem => ModelManager.create(elem.widget, elem))) : [[],[], [], []];
    }

    clone() {
        return new WidgetFourColumnsLayout(this);
    }
}