import "./styles.scss";
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";

export default class WidgetPuzzle extends WidgetPiecesElement {

    static widget = "Puzzle";
    static type = "element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-puzzle";

    constructor(values: any) { super(values); }

    clone(): WidgetPuzzle { return new WidgetPuzzle(this); }
}
