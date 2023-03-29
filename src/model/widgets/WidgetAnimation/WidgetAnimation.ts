import './styles.scss';
import WidgetPiecesElement from "../WidgetPiecesElement/WidgetPiecesElement";
import icon from "./icon.png";
import { InputWidgetPiecesElementData } from '../../../types';

export default abstract class WidgetAnimation extends WidgetPiecesElement {

    static widget = "Animation";
    static category = "interactiveElements";
    static icon = icon;

    constructor(values?: any) { super(values); }

    static async create(values?: InputWidgetPiecesElementData): Promise<WidgetAnimation> { return null; }
}