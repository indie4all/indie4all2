import './styles.scss';
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";

export default class WidgetAnimation extends WidgetPiecesElement {

    static widget = "Animation";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-animation";

    constructor(values?: any) { super(values); }

    clone(): WidgetAnimation {
        const widget = new WidgetAnimation();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetAnimation.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }
}