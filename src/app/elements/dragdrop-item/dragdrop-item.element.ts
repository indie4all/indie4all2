import "./styles.scss";
import icon from "./icon.png";
import { FormEditData, InputWidgetDragDropItemData, WidgetDragDropItemData, WidgetInitOptions } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default class DragdropItemElement extends SpecificItemElement {

    static widget = "DragdropItem";
    static icon = icon;

    data: WidgetDragDropItemData;

    constructor() { super(); }

    async init(values?: InputWidgetDragDropItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { term: "", definition: "" };
    }

    get form(): Promise<string> {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                term: this.data.term,
                definition: this.data.definition
            }));
    }

    get preview() {
        return this.data?.term && this.data?.definition ?
            `<p><b>${this.data.term}</b><span> -> ${this.data.definition}</span></p>` :
            this.translate("widgets.DragdropItem.prev");
    }

    get texts() {
        return { "term": this.data.term, "definition": this.data.definition };
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.term = form.term;
        this.data.definition = form.definition;
    }

    set texts(texts: any) {
        this.data.term = texts.term;
        this.data.definition = texts.definition;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.term.length == 0) errors.push("DragpdropItem.term.invalid");
        if (this.data.definition.length == 0) errors.push("DragpdropItem.definition.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.term.length == 0) errors.push("DragpdropItem.term.invalid");
        if (form.definition.length == 0) errors.push("DragpdropItem.definition.invalid");
        return errors;
    }
}
