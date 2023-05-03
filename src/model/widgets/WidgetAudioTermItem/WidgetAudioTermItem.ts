/* global $ */
import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAudioTermItemData, WidgetAudioTermItemData } from "../../../types";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";

export default abstract class WidgetAudioTermItem extends WidgetSpecificItemElement {

    static widget = "AudioTermItem";
    static icon = icon;
    data: WidgetAudioTermItemData;

    static async create(values?: InputWidgetAudioTermItemData): Promise<WidgetAudioTermItem> { return null; }

    constructor(values?: InputWidgetAudioTermItemData) {
        super(values);
    }

    getTexts() {
        return {
            "term": this.data.term,
            "definition": this.data.definition
        }
    }

    preview(): string {
        return this.data?.term && this.data?.definition ?
            this.data.term + " -> " + this.data.definition :
            this.translate("widgets.AudioTermItem.prev");
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

    updateTexts(texts: any): void {
        this.data.term = texts.term;
        this.data.definition = texts.definition;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (this.data.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (form.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        return errors;
    }
}
