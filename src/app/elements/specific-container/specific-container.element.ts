import ContainerElement from "../container/container.element";

export default abstract class SpecificContainerElement extends ContainerElement {

    protected static _addable: boolean = true;

    constructor() { super(); }
}