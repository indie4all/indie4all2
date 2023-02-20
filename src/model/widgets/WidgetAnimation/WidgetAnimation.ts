import './styles.scss';
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";

export default class WidgetAnimation extends WidgetPiecesElement {

    static widget = "Animation";
    static type = "element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-animation";

    constructor(values: any) { super(values); }

    clone(): WidgetAnimation { return new WidgetAnimation(this); }
}