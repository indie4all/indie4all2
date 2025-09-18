/* global $ */
import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAudioTermItemData, WidgetAudioTermItemData, WidgetInitOptions } from "../../../types";
import SpecificItemElement from '../specific-item/specific-item.element';

export default abstract class AudioTermItemElement extends SpecificItemElement {

    static widget = "AudioTermItem";
    static icon = icon;
    data: WidgetAudioTermItemData;

    constructor() { super(); }

    async init(values?: InputWidgetAudioTermItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
    }

    get preview() {
        return this.data?.term && this.data?.definition ?
            this.data.term + " -> " + this.data.definition :
            this.translate("widgets.AudioTermItem.prev");
    }

    get texts() {
        return {
            "term": this.data.term,
            "definition": this.data.definition
        }
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
