import Utils from "../../../Utils";
import "./styles.scss";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetTermClassificationItem from "../WidgetTermClassificationItem/WidgetTermClassificationItem";
import { FormEditData } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetTermClassification extends WidgetContainerSpecificElement {

    static widget = "TermClassification";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-term-classification";

    /**
     * 
     * @param {WidgetTermClassificationItem[]} items TermClassificatonItem item array 
     * @returns {string[]} duplicated columns
     */
    private static getDuplicatedColumn(items: WidgetTermClassificationItem[]) {
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
    private static getDuplicatedTerms(items: WidgetTermClassificationItem[]): string[] {
        if (items && items.length > 0) {
            const allTerms = items.reduce((prev: string[], curr) => prev.concat(curr.data.terms), []);
            const duplicatedTerms = allTerms.filter((item, pos, self) => self.indexOf(item) !== pos);
            const uniqueTerms = new Set(duplicatedTerms);
            return Array.from(uniqueTerms);
        }
        return [];
    }

    params: { name: string, help: string }
    data: WidgetTermClassificationItem[]

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: `Terms and Classification-${this.id}`,
            help: ""
        };
        this.data = values?.data ? values.data.map((elem: any) => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetTermClassification {
        const widget = new WidgetTermClassification();
        widget.params = structuredClone(this.params);
        widget.params.name = "Terms and Classification-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help,
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TermClassification.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.TermClassification.prev");
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        const duplicatedcolumns = WidgetTermClassification.getDuplicatedColumn(this.data);
        if (duplicatedcolumns.length > 0) errors.push("TermClassification.data.duplicatedColumn")
        const duplicatedTermsBetweenColumns = WidgetTermClassification.getDuplicatedTerms(this.data);
        if (duplicatedTermsBetweenColumns.length > 0) errors.push("TermClassification.data.duplicatedTerms")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }
}
