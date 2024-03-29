import I18n from "../I18n";
import { FormEditData } from "../types";
import Utils from "../Utils";

export default abstract class ModelElement {

    static widget: string;
    protected static addable: boolean = false;
    protected static copyable: boolean = true;
    protected static editable: boolean = true;
    protected static deletable: boolean = true;

    id: string;
    params: any;
    data: any;
    skipNameValidation: boolean = false;

    static async create(values?: any): Promise<ModelElement> { return null; }

    constructor(values?: any) {
        this.id = values?.id ?? Utils.generate_uuid();
    }

    abstract clone(): ModelElement;
    abstract createElement(): string;
    abstract getInputs(): Promise<FormEditData>
    abstract getTexts(): any;
    abstract preview(): string
    abstract updateModelFromForm(form: any): void;
    abstract updateTexts(texts: any): void;
    abstract validateForm(form: any): string[];
    abstract validateModel(): string[];

    static hasChildren() { return false; }
    settingsClosed(): void { }
    settingsOpened(): void { }
    toJSON(): any { return { id: this.id, widget: (<typeof ModelElement>this.constructor).widget } }
    translate(query: string) { return I18n.getInstance().value(query); }
    onSubmitEditForm(): void { }
    onHideEditModal(): void { }

    static setAddable(value: boolean) { this.addable = value }
    static setCopyable(value: boolean) { this.copyable = value }
    static setEditable(value: boolean) { this.editable = value }
    static setDeletable(value: boolean) { this.deletable = value }

}