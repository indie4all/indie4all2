import ContainerElement from "../container/container.element";

export default abstract class ContainerSpecificElement extends ContainerElement {

    protected static _addable: boolean = true;
    protected static _generable: boolean = true;

    constructor() { super(); }
}