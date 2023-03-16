import "./styles.scss";
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";

export default class WidgetPuzzle extends WidgetPiecesElement {

    static widget = "Puzzle";
    static category = "interactiveElements";
    static icon = icon;

    constructor(values?: any) { super(values); }

    clone(): WidgetPuzzle {
        const widget = new WidgetPuzzle();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetPuzzle.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }
}
