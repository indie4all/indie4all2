import ModelManager from "../../ModelManager";
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import './styles.scss';
import icon from "./icon.png";

export default class WidgetThreeColumnsLayout extends WidgetColumnsLayout {
    
    static widget = "ThreeColumnsLayout";
    static type = "layout";
    static allow = ["element", "specific-element-container"];
    static category = "layouts";
    static toolbar = { edit: false };
    static icon = icon;
    static columns = [4,4,4];

    constructor(values) {
        super(values);
        this.data = values?.data ? values.data.map(arr => arr.map(elem => ModelManager.create(elem.widget, elem))) : [[],[], []];
    }

    clone() {
        return new WidgetThreeColumnsLayout(this);
    }
}