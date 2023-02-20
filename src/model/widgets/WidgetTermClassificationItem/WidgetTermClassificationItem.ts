import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetTermClassificationItem extends WidgetItemElement {

    static widget = "TermClassificationItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-column-classificacion-item";
    static paletteHidden = true;

    /**
     * Parse a string with terms separated with semicolon and returns an array of terms
     * 
     * @param terms {String} Semicolon separated terms
     * @returns {String[]} Array of terms
     */
    private static parseTerms(terms: string) {
        let termsArray: string[] = [];
        let termsCopy: string;

        if (this.matchTerms(terms)) {
            termsCopy = terms.endsWith(";") ? terms.slice(0, -1) : terms;
            termsArray = termsCopy.split(";").map(term => term.trim().replace(/\s+/g, ' '));
            termsArray = Array.from(new Set(termsArray));
        }
        return termsArray;
    }

    private static reduceTerms(terms: string[]) {
        return terms.map(t => t.trim()).reduce((pv, cv) => pv + ";" + cv);
    }

    private static matchTerms(terms: string) {
        const regex = /^[\p{L}\d\s]+(;[\p{L}\d\s]*)*$/u;
        if (Utils.isStringEmptyOrWhitespace(terms)) return false;
        return regex.test(terms);
    }

    data: { column: string, terms: string[] }

    constructor(values: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { column: "", terms: [] };
    }

    clone(): WidgetTermClassificationItem {
        return new WidgetTermClassificationItem(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            column: this.data.column,
            terms: this.data.terms.length > 0 ? WidgetTermClassificationItem.reduceTerms(this.data.terms) : ""
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TermClassificationItem.label")
        };
    }

    preview(): string {
        let prev = this.translate("widgets.TermClassificationItem.prev");
        if (this.data.column && this.data.terms.length > 0) {
            const allWords = WidgetTermClassificationItem.reduceTerms(this.data.terms);
            prev = `${this.data.column} - ${allWords}`;
        }
        return prev;
    }

    updateModelFromForm(form: any): void {
        this.data.column = form.column;
        this.data.terms = WidgetTermClassificationItem.parseTerms(form.terms);
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.column.length === 0) errors.push("TermClassificationItem.column.empty");
        if (this.data.terms.length === 0) errors.push("TermClassificationItem.terms.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        const keys: string[] = [];
        if (!WidgetTermClassificationItem.matchTerms(form.terms)) keys.push("TermClassificationItem.terms.invalid");
        return keys;
    }

}