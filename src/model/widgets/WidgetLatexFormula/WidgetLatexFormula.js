import preview from "./preview.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from '../WidgetItemElement/WidgetItemElement';

export default class WidgetLatexFormula extends WidgetItemElement {
    
    static widget = "LatexFormula";
    static type = "element";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAEGElEQVRoge2ZXWjTUBTHT9NuYie2g6oIEkURP0ARRAri3HzROQU3kaLOISIWP17ci6Y+KcjaN+fL1KKouIEMUR+sWBDcnIJzTMTBFJ+6+SIoaP3ogzaNnNPcLJ1pe5vGpsL+ENK0N7m/e/I/56a5DtBJ9AfWAUAr2KsEANyfHO7/mo9Cgxb9gQsAcHLRwnmAm1168WocVPC2yeH+13kxRH/grOgPKPHBl4rdSn7/oTR3nFJEf+CL6A94C0F/uXY7ZjswE4JvbD2B4CeNeAXRH2gCAO+eHY02W3lKc+fUwdbGDXi8y+h3gX3AhtUkTwEeoapIOTUDbbVm1dZ4pXC0SQpHc6qIy2w/ytgE/G7pAkim/gmwPE8G76q5ONk9AYCvUjjaGQkFb0A50HL4HgE71iwGh9dtKTAp9REAfrEjjPR1KRxNRELBAdPQmaG3AB431Dw/bxmnXs6rdwDuP57+9UEAGDDlabQGRlloWGUlJ4+WgNlEzAy9o71jU8WhSeYjjSc3rLSah0vmoFU/YxLaoZKhlcnPtAlr7QGGHGjOektRttHPoIdO7+/mOiHzLAtt2s/JFCjP3mqbmclJg8a6m3kwWvSEciMt98Th975umpxo3xMv+Ro5npal3oIj1/xcZn3GfHDFzpjOCw1aaG8goEIjLxrlZArSO7poY3cNr8m+Qzs4Q20EjG0zbybAsUY0D+2KHKAyJofvUkeG0MXqs8cNIPrIavRsgrbreUTHysSnnMGmpV66Y8LO9eahsUNnaDd9lI9FDRvzzITO49u0AWK05b6hbEftm7U2GHH8zXUpWDIwTPc0dogTBiWl2pkmzPqxiaJ+xvNZGy1HMCDqYFDpo9FsgDzmng7/mlxcl49kLzwtKTPMzxweRN+C6mc6Pt6sAWLOUELHRrPenx4cDv31aIqRwqjgxdHfTvS6ekuBs9RhG4fo06AxyZnQw8Ja3cDF0l8MGU7j7NZRVNTkY37mKXc0ceiSWR9NHAwNim2izxpoBHapEZalPs3P9IDE4UNWOaYs8cjSv2V5H5jwlmJU0ctptZrwTN1UGVT/U3VA8GTK1MxXMjTKGWmnPZsoeGoqizKrwZSEFke7IDTaoebhGfI47osloT7KrIJQqbM42kX/2CKok/PhCNvWfruV+6XHDbUfrpgGNNLMG6ZKaQa6UvpvoXFRhi3QVI3iT0egzj3bGHpyuB+hB85134RvP35WBfOd2CCMv0/AUnGh4e+sTneOv0882d5x2nt4bwusXr6kopBMGLT44AhBr1gmwnxfvWE7/Toivk7FtcQm9qLPDi3w1RNwnrXMgUgouEWbEdUV0kNGLaVwVLFrEEbirR75V04rK+Lghe6sAmB0wkXghcYlA1yrZuXRBmH/WyKhoF39lykA+APNg7K3Lx9XeQAAAABJRU5ErkJggg==";
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

