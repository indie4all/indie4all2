import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetTermClassificationContainerData, WidgetInitOptions, WidgetTermClassificationContainerParams } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import TermClassificationItemElement from "../term-classification-item/term-classification-item.element";

export default class TermClassificationElement extends ContainerSpecificElement {

    static widget = "TermClassification";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetTermClassificationContainerParams;
    data: TermClassificationItemElement[]

    constructor() { super(); }

    async init(values?: InputWidgetTermClassificationContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: `Terms and Classification-${this.id}`,
            help: ""
        };
        if (options.regenerateId) this.params.name = `Terms and Classification-${this.id}`;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(TermClassificationItemElement.widget, elem, options) as Promise<TermClassificationItemElement>
        )) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }));
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.TermClassification.prev");
    }

    /**
     * 
     * @param {WidgetTermClassificationItem[]} items TermClassificatonItem item array 
     * @returns {string[]} duplicated columns
     */
    private static getDuplicatedColumn(items: TermClassificationItemElement[]) {
        if (items && items.length > 0) {
            const repeatedColumns = items.map(item => item.data.column).filter((item, pos, self) => self.indexOf(item) !== pos);
            const uniqueColumnsSet = new Set(repeatedColumns);
            return Array.from(uniqueColumnsSet);
        }

        return [];
    }

    /**
     * 
     * @param {WidgetTermClassificationItem[]} items TermClassificatonItem item array 
     * @returns {string[]} duplicated terms
     */
    private static getDuplicatedTerms(items: TermClassificationItemElement[]): string[] {
        if (items && items.length > 0) {
            const allTerms = items.reduce((prev: string[], curr) => prev.concat(curr.data.terms), []);
            const duplicatedTerms = allTerms.filter((item, pos, self) => self.indexOf(item) !== pos);
            const uniqueTerms = new Set(duplicatedTerms);
            return Array.from(uniqueTerms);
        }
        return [];
    }


    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        const duplicatedcolumns = TermClassificationElement.getDuplicatedColumn(this.data);
        if (duplicatedcolumns.length > 0) errors.push("TermClassification.data.duplicatedColumn")
        const duplicatedTermsBetweenColumns = TermClassificationElement.getDuplicatedTerms(this.data);
        if (duplicatedTermsBetweenColumns.length > 0) errors.push("TermClassification.data.duplicatedTerms")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }
}
