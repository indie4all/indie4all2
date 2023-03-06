import I18n from "../I18n";
import { FormEditData } from "../types";
import Utils from "../Utils";

export default abstract class ModelElement {

    static type: string;
    static widget: string;
    static allows(): (abstract new (...args: any[]) => ModelElement)[] { return [] }
    static refuses(): (abstract new (...args: any[]) => ModelElement)[] { return [] }

    protected static addable: boolean = false;
    protected static copyable: boolean = true;
    protected static editable: boolean = true;

    static canHave(proto: typeof ModelElement) {
        const constructor = <typeof ModelElement>this.constructor;
        return !constructor.refuses().some(elem => proto instanceof elem) &&
            constructor.allows().some(elem => proto instanceof elem);
    }

    id: string;
    params: any;
    data: any;
    skipNameValidation: boolean = false;

    constructor(values?: any) {
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
    settingsClosed(): void { }
    settingsOpened(): void { }
    toJSON(): any { return { id: this.id, widget: (<typeof ModelElement>this.constructor).widget } }
    translate(query: string) { return I18n.getInstance().value(query); }
}