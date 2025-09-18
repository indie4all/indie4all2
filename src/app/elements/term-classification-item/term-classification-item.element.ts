import './styles.scss';
import icon from "./icon.png";
import { InputWidgetTermClassificationItemData, WidgetInitOptions, WidgetTermClassificationItemData } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default class TermClassificationItemElement extends SpecificItemElement {

    static widget = "TermClassificationItem";
    static icon = icon;

    /**
     * Parse a string with terms separated with semicolon and returns an array of terms
     * 
     * @param terms {string} Semicolon separated terms
     * @returns {string[]} Array of terms
     */
    private parseTerms(terms: string): string[] {
        let termsArray: string[] = [];
        let termsCopy: string;

        if (this.matchTerms(terms)) {
            termsCopy = terms.endsWith(";") ? terms.slice(0, -1) : terms;
            termsArray = termsCopy.split(";").map(term => term.trim().replace(/\s+/g, ' '));
            termsArray = Array.from(new Set(termsArray));
        }
        return termsArray;
    }

    private reduceTerms(terms: string[]) {
        return terms.map(t => t.trim()).reduce((pv, cv) => pv + ";" + cv);
    }

    private matchTerms(terms: string) {
        const regex = /^[^;]+(?:;[^;]*)*$/u;
        if (this.utils.isStringEmptyOrWhitespace(terms)) return false;
        return regex.test(terms);
    }

    data: WidgetTermClassificationItemData;

    constructor() { super(); }

    async init(values?: InputWidgetTermClassificationItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { column: "", terms: [] };
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            column: this.data.column,
            terms: this.data.terms.length > 0 ? this.reduceTerms(this.data.terms) : ""
        }));
    }

    get texts() {
        return { "column": this.data.column, "terms": this.data.terms }
    }

    get preview(): string {
        let prev = this.translate("widgets.TermClassificationItem.prev");
        if (this.data.column && this.data.terms.length > 0) {
            const allWords = this.reduceTerms(this.data.terms);
            prev = `${this.data.column} - ${allWords}`;
        }
        return prev;
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.column = form.column;
        this.data.terms = this.parseTerms(form.terms);
    }

    set texts(texts: any) {
        this.data.column = texts.column;
        this.data.terms = texts.terms;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.column.length === 0) errors.push("TermClassificationItem.column.empty");
        if (this.data.terms.length === 0) errors.push("TermClassificationItem.terms.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        const keys: string[] = [];
        if (!this.matchTerms(form.terms)) keys.push("TermClassificationItem.terms.invalid");
        return keys;
    }

}