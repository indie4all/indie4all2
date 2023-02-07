import './styles.scss';
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";

export default class WidgetAnimation extends WidgetPiecesElement {
    
    static widget = "Animation";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-animation";

    constructor(values) { super(values); }

    clone() { return new WidgetAnimation(this); }
}