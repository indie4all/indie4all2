import './styles.scss';
import icon from "./icon.png";
import PiecesElement from '../pieces/pieces.element';

export default abstract class AnimationElement extends PiecesElement {

    static widget = "Animation";
    static category = "interactiveElements";
    static icon = icon;

    constructor() { super(); }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }
}