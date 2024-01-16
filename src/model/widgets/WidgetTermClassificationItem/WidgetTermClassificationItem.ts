import Utils from "../../../Utils";
import './styles.scss';
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetTermClassificationItemData, WidgetTermClassificationItemData } from "../../../types";

export default class WidgetTermClassificationItem extends WidgetSpecificItemElement {

    static widget = "TermClassificationItem";
    static icon = icon;

    /**
     * Parse a string with terms separated with semicolon and returns an array of terms
     * 
     * @param terms {string} Semicolon separated terms
     * @returns {string[]} Array of terms
     */
    private static parseTerms(terms: string): string[] {
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
        const regex = /^[^;]+(?:;[^;]*)*$/u;
        if (Utils.isStringEmptyOrWhitespace(terms)) return false;
        return regex.test(terms);
    }

    data: WidgetTermClassificationItemData;

    static async create(values?: InputWidgetTermClassificationItemData): Promise<WidgetTermClassificationItem> {
        return new WidgetTermClassificationItem(values);
    }

    constructor(values?: InputWidgetTermClassificationItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { column: "", terms: [] };
    }

    clone(): WidgetTermClassificationItem {
        const widget = new WidgetTermClassificationItem();
        widget.data = structuredClone(this.data);
        return widget;
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

    getTexts() {
        return { "column": this.data.column, "terms": this.data.terms }
    }

    preview(): string {
        let prev = this.translate("widgets.TermClassificationItem.prev");
        if (this.data.column && this.data.terms.length > 0) {
            const allWords = WidgetTermClassificationItem.reduceTerms(this.data.terms);
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
        this.data.terms = WidgetTermClassificationItem.parseTerms(form.terms);
    }

    updateTexts(texts: any): void {
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
        if (!WidgetTermClassificationItem.matchTerms(form.terms)) keys.push("TermClassificationItem.terms.invalid");
        return keys;
    }

}