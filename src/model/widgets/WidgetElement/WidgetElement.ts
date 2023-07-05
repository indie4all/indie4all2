import I18n from "../../../I18n";
import ModelElement from "../../ModelElement";
import palette from "./palette.hbs";
import './styles.scss';

export default abstract class WidgetElement extends ModelElement {

    // Category - Category of the palette to include the widget in. Hidden if not set
    static category: string;
    protected static icon: string;


    constructor(values?: any) { super(values); }

    static createPaletteItem() {
        const label = I18n.getInstance().translate(`widgets.${this.widget ?? "GenericWidget"}.label`);
        return palette({ category: this.category, widget: this.widget, icon: this.icon, label });
    }
}