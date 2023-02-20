import { Model } from "../model/Model";

export default class ActionElement {
    model: Model;
    data: any;

    constructor(model: Model, data: any) {
        this.model = model;
        this.data = data;
    }

    do() { }
    undo() { }
}