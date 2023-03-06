import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default abstract class WidgetSpecificContainerElement extends WidgetContainerElement {

    protected static addable: boolean = true;

    constructor(values?: any) { super(values); }
}