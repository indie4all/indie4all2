import preview from "./preview.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from '../WidgetItemElement/WidgetItemElement';
import icon from "./icon.png";

export default class WidgetLatexFormula extends WidgetItemElement {
    
    static widget = "LatexFormula";
    static type = "element";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-latexformula";

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { formula: "", caption: "" };
    }

    clone() {
        return new WidgetLatexFormula(this);
    }

    /**
     * Parse the latex formula inside a dom element
     * 
     * @param {string} formula Latex formula
     * @param {Element} domElement DOM element where the formula will be displayed
     */
    #showFormula(formula, domElement) {
        import ('katex/dist/katex.css').then(() => {
            import('katex').then(({default: katex}) => {
                katex.render(formula, domElement, {
                    throwOnError: false
                });
            });
        });
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                formula: this.data.formula,
                caption: this.data.caption
            }

            return {
                inputs: form(data),
                title: 'Latex Formula' // TODO: i18n
            };
        });
    }

    preview() {
        return this.data?.caption && this.data?.formula ? preview(this.data) : this.translate("widgets.LatexFormula.prev");
    }

    settingsOpened() {
        var formulaInput = document.querySelector('[data-content="formula"]');
        var formulaPreview = document.querySelector('[data-content="formula-preview"]');
        var timeout = null;

        if (!Utils.isEmpty(this.data))
            this.#showFormula(this.data.formula, formulaPreview);

        const self = this;
        formulaInput.onkeyup = function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                self.#showFormula(formulaInput.value, formulaPreview);
            }, 500);
        };
    }

    updateModelFromForm(form) {
        this.data.formula = form.formula;
        this.data.caption = form.caption;
    }

    validateModel() {
        var errors = [];
        if (this.data.formula.length == 0) errors.push("LatexFormula.formula.invalid");
        if (this.data.caption.length == 0) errors.push("LatexFormula.caption.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.formula.length == 0) errors.push("LatexFormula.formula.invalid");
        if (form.caption.length == 0) errors.push("LatexFormula.caption.invalid");
        return errors;
    }
    
}

