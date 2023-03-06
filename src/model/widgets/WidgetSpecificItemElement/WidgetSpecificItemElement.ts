import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default abstract class WidgetSpecificItemElement extends WidgetItemElement {

    protected static copyable: boolean = false;

    constructor(values?: any) { super(values); }
}