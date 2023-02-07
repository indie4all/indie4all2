import "./styles.scss";
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";

export default class WidgetPuzzle extends WidgetPiecesElement {

    static widget = "Puzzle";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-puzzle";

    constructor(values) { super(values); }

    clone() { return new WidgetPuzzle(this); }
}
