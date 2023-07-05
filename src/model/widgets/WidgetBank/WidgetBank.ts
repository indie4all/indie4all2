/* global $ */
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";
import WidgetElement from "../WidgetElement/WidgetElement";

export default class WidgetBank extends WidgetElement {

    static widget = "Bank";
    static category = "bankWidgets";
    static icon = icon;

    static async create(): Promise<WidgetElement> {
    
        return new WidgetBank();
    }

    constructor() {
        super();
    }

    getInputs(): Promise<FormEditData> {
        throw new Error("Method not implemented.");
    }
    getTexts() {
        throw new Error("Method not implemented.");
    }
    preview(): string {
        throw new Error("Method not implemented.");
    }
    updateModelFromForm(form: any): void {
        throw new Error("Method not implemented.");
    }
    updateTexts(texts: any): void {
        throw new Error("Method not implemented.");
    }
    validateForm(form: any): string[] {
        throw new Error("Method not implemented.");
    }
    validateModel(): string[] {
        throw new Error("Method not implemented.");
    }

    createElement(): string {
        throw new Error("Method not implemented.");
    }


    clone(): WidgetBank {
        const widget = new WidgetBank();
        widget.data = structuredClone(this.data);
        return widget;
    }

}