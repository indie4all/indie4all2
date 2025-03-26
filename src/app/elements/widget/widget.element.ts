import Element from "../element/element";

export default abstract class WidgetElement extends Element {

    // Category - Category of the palette to include the widget in. Hidden if not set
    static category: string;
    static icon: string;
}