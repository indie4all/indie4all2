import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetTermClassificationItem extends WidgetItemElement {

    static widget = "TermClassificationItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-column-classificacion-item";
    static paletteHidden = true;

    functions = {
        /**
         * Parse a string with temrs separated with semicolon and returns an array of terms
         * 
         * @param terms {String} Semicolon separated terms
         * @returns {String[]} Array of terms
         */
        parseTerms: function (terms) {
            let termsArray = [];
            let termsCopy;

            if (this.matchTerms(terms)) {
                termsCopy = terms.endsWith(";") ? terms.slice(0, -1) : terms;
                termsArray = termsCopy.split(";").map(term => {
                    return term.trim().replace(/\s+/g, ' ');
                });

                termsArray = Array.from(new Set(termsArray));
            }

            return termsArray;
        },
        reduceTerms: function (terms) {
            return terms.map(t => t.trim()).reduce((pv, cv) => pv + ";" + cv);
        },
        matchTerms: function (terms) {
            const regex = /^[\p{L}\d\s]+(;[\p{L}\d\s]*)*$/u;
            if (Utils.isStringEmptyOrWhitespace(terms)) return false;
            return regex.test(terms);
        }
    }

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { column: "", terms: [] };
    }

    clone() {
        return new WidgetTermClassificationItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                column: this.data.column,
                terms: this.data.terms.length > 0 ? this.functions.reduceTerms(this.data.terms) : ""
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.TermClassificationItem.label")
            };
        });
    }

    preview() {
        let prev = this.translate("widgets.TermClassificationItem.prev");
        if (this.data.column && this.data.terms.length > 0) {
            const allWords = this.functions.reduceTerms(this.data.terms);
            prev = `${this.data.column} - ${allWords}`;
        }
        return prev;
    }

    updateModelFromForm(form) {
        this.data.column = form.column;
        this.data.terms = this.functions.parseTerms(form.terms);
    }

    validateModel() {
        var errors = [];
        if (this.data.column.length === 0) errors.push("TermClassificationItem.column.empty");
        if (this.data.terms.length === 0) errors.push("TermClassificationItem.terms.empty");
        return errors;
    }

    validateForm(form) {
        const keys = [];
        if (!this.functions.matchTerms(form.terms)) keys.push("TermClassificationItem.terms.invalid");
        return keys;
    }

}