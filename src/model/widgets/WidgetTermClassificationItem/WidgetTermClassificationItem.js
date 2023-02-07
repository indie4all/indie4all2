import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetTermClassificationItem extends WidgetItemElement {

    static widget = "TermClassificationItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAnFBMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///8eN1Z4h5qOm6pWaIBhc4nHzdX5DVz6KnDx8vTj5ur8hq39wtb9pMKqtL/8dqP7Z5lygpU5T2v3GGQ0Mlf/8PX+4ev+0eD6SYRPY3tHXHW4wMqcp7WAjqD7WI7UJ2iTKF5HL1d5YSg4AAAAEnRSTlMAQECA/jD34NBgELqmoJeAcDCW+Nc0AAABIElEQVRIx83U23KCMBCA4ZgCWnvOJoBBQLB46rl9/3drgGiQTtm90fG/ysU3TFhCWB0f7om5rgJACq739tZ7T8Rg8w+wmsObQFPBtN3Eq8BLgLc4FITOjNWh7voIz+Mmg0HZoLeOxg8Wq+fQBDUWNuitIynvLFbChGHpH+HZn9IuHpGf7LDbM47dNHC87wR4ETbRsFrGJqDg/pzTA84txue8/tZ6Q9vGqqi+MtoLbstZuaWNLttVxYo251zrdD0wjVg11VtNtc6R0YXtD7Epql1GnfNn+YN8FOQ8n/Pw41eBw/gl4zDaxWHSzW8xhxjHyls2mN14iwR5roIX2WJ2D1iesRazKTc9Rv9noMU2X6I5zCaYHTOXP0Gsz7qNBjPgFwmdi7gk6W/UAAAAAElFTkSuQmCC";
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