import preview from "./preview.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from '../WidgetItemElement/WidgetItemElement';
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetLatexFormula extends WidgetItemElement {

    static widget = "LatexFormula";
    static category = "simpleElements";
    static icon = icon;
    static cssClass = "widget-latexformula";

    data: { formula: string, caption: string }

    constructor(values?: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { formula: "", caption: "" };
    }

    clone(): WidgetLatexFormula {
        const widget = new WidgetLatexFormula();
        widget.data = structuredClone(this.data);
        return widget;
    }

    /**
     * Parse the latex formula inside a dom element
     * 
     * @param {string} formula Latex formula
     * @param {Element} domElement DOM element where the formula will be displayed
     */
    private showFormula(formula: string, domElement: Element) {
        import('katex/dist/katex.css').then(() => {
            import('katex').then(({ default: katex }) => {
                katex.render(formula, domElement, {
                    throwOnError: false
                });
            });
        });
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            formula: this.data.formula,
            caption: this.data.caption
        };
        return {
            inputs: form(data),
            title: 'Latex Formula' // TODO: i18n
        };
    }

    preview(): string {
        return this.data?.caption && this.data?.formula ? preview(this.data) : this.translate("widgets.LatexFormula.prev");
    }

    settingsOpened(): void {
        var formulaInput = <HTMLInputElement>document.querySelector('[data-content="formula"]');
        var formulaPreview = document.querySelector('[data-content="formula-preview"]');
        var timeout: NodeJS.Timeout;

        if (!Utils.isEmpty(this.data))
            this.showFormula(this.data.formula, formulaPreview);

        const self = this;
        formulaInput.onkeyup = function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                self.showFormula(formulaInput.value, formulaPreview);
            }, 500);
        };
    }

    updateModelFromForm(form: any): void {
        this.data.formula = form.formula;
        this.data.caption = form.caption;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.formula.length == 0) errors.push("LatexFormula.formula.invalid");
        if (this.data.caption.length == 0) errors.push("LatexFormula.caption.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.formula.length == 0) errors.push("LatexFormula.formula.invalid");
        if (form.caption.length == 0) errors.push("LatexFormula.caption.invalid");
        return errors;
    }

}

