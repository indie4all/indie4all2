import "./styles.scss";
import icon from "./icon.png";
import PiecesElement from "../pieces/pieces.element";

export default abstract class PuzzleElement extends PiecesElement {

    static widget = "Puzzle";
    static category = "interactiveElements";
    static icon = icon;

    constructor() { super(); }
}
