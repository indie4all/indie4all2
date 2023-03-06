import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default abstract class WidgetContainerSpecificElement extends WidgetContainerElement {

    protected static addable: boolean = true;

    constructor(values?: any) {
        super(values);
    }
}