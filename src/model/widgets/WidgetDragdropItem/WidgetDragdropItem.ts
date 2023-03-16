import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetDragdropItem extends WidgetSpecificItemElement {

    static widget = "DragdropItem";
    static icon = icon;

    data: { term: string, definition: string }

    constructor(values?: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { term: "", definition: "" };
    }

    clone(): WidgetDragdropItem {
        const widget = new WidgetDragdropItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            term: this.data ? this.data.term : '',
            definition: this.data ? this.data.definition : ''
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.DragdropItem.label")
        };
    }

    preview(): string {
        return this.data?.term && this.data?.definition ?
            `<p><b>${this.data.term}</b><span> -> ${this.data.definition}</span></p>` :
            this.translate("widgets.DragdropItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.term = form.term;
        this.data.definition = form.definition;
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
