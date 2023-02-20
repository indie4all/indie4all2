import I18n from "../I18n";
import { FormEditData } from "../types";
import Utils from "../Utils";

export default abstract class ModelElement {

    static type: string;
    static widget: string;
    static allow: string[];

    id: string;
    params: any;
    data: any;
    skipNameValidation: boolean = false;

    constructor(values: any) {
        this.id = values?.id ?? Utils.generate_uuid();
    }

    abstract clone(): ModelElement;
    abstract createElement(): string;
    abstract getInputs(): Promise<FormEditData>
    abstract preview(): string
    abstract updateModelFromForm(form: any): void;
    abstract validateForm(form: any): string[];
    abstract validateModel(): string[];

    static hasChildren() { return false; }
    regenerateIDs() { this.id = Utils.generate_uuid(); }
    settingsClosed(): void { }
    settingsOpened(): void { }
    toJSON(): any { return { id: this.id, widget: ModelElement.widget } }
    translate(query: string) { return I18n.getInstance().value(query); }
}