export default class ActionElement {

    constructor(modelId, container, model, data) {
        this.modelId = modelId;
        this.container = container;
        this.model = model;
        this.data = data;
    }

    do() {}
    undo() {}

    clearElement(elementString) {
        return elementString.replace('gu-transit', '');
    }
}