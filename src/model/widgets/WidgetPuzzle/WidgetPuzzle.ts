import "./styles.scss";
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";
import { InputWidgetPiecesElementData } from "../../../types";

export default abstract class WidgetPuzzle extends WidgetPiecesElement {

    static widget = "Puzzle";
    static category = "interactiveElements";
    static icon = icon;

    static async create(values?: InputWidgetPiecesElementData): Promise<WidgetPuzzle> { return null; }

    constructor(values?: InputWidgetPiecesElementData) { super(values); }
}
