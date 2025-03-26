import preview from "./preview.hbs";
import "./styles.scss";
import icon from "./icon.png";
import { InputLatexFormulaData, WidgetInitOptions, WidgetLatexFormulaData } from "../../../types";
import ItemElement from "../item/item.element";

export default class LatexFormulaElement extends ItemElement {

    static widget = "LatexFormula";
    static category = "simpleElements";
    static icon = icon;

    data: WidgetLatexFormulaData;

    constructor() { super(); }

    async init(values?: InputLatexFormulaData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { formula: "", caption: "" };
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

    get form(): Promise<string> {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                formula: this.data.formula,
                caption: this.data.caption
            }));
    }

    get texts() { return { "caption": this.data.caption } }

    get preview(): string {
        return this.data?.formula ? preview(this.data) : this.translate("widgets.LatexFormula.prev");
    }

    settingsOpened(): void {
        var formulaInput = <HTMLInputElement>document.querySelector('[data-content="formula"]');
        var formulaPreview = document.querySelector('[data-content="formula-preview"]');
        var timeout: NodeJS.Timeout;

        if (!this.utils.isEmpty(this.data))
            this.showFormula(this.data.formula, formulaPreview);

        const self = this;
        formulaInput.onkeyup = function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                self.showFormula(formulaInput.value, formulaPreview);
            }, 500);
        };
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.formula = form.formula;
        this.data.caption = form.caption;
    }

    set texts(texts: any) {
        this.data.caption = texts.caption;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.formula.length == 0) errors.push("LatexFormula.formula.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.formula.length == 0) errors.push("LatexFormula.formula.invalid");
        return errors;
    }

}

