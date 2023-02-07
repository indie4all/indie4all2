import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetTermClassification extends WidgetContainerElement {
    
    static widget = "TermClassification";
    static type = "specific-element-container";
    static allow = ["TermClassificationItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-term-classification";

    functions = {
        /**
         * 
         * @param {any[]} items TermClassificatonItem item array 
         * @returns {string[]} duplicated columns
         */
        getDuplicatedColumn: function (items) {
            if (items && items.length > 0) {
                const repeatedColumns = items.map(item => item.data.column).filter((item, pos, self) => self.indexOf(item) !== pos);
                const uniqueColumnsSet = new Set(repeatedColumns);
                return Array.from(uniqueColumnsSet);
            }

            return [];
        },
        /**
         * 
         * @param {any[]} items TermClassificatonItem item array 
         * @returns {string[]} duplicated terms
         */
        getDuplicatedTerms: function (items) {
            if (items && items.length > 0) {
                const allTerms = items.reduce((prev, curr) => prev.concat(curr.data.terms), []);
                const duplicatedTerms = allTerms.filter((item, pos, self) => self.indexOf(item) !== pos);
                const uniqueTerms = new Set(duplicatedTerms);
                return Array.from(uniqueTerms);
            }

            return [];
        }
    }

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: `Terms and Classification-${Utils.generate_uuid()}`,
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetTermClassification(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                image: this.data.image,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.TermClassification.label")
            }
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.TermClassification.prev");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Terms and Classification-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var errors = [];
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        const duplicatedcolumns = this.functions.getDuplicatedColumn(this.data);
        if (duplicatedcolumns.length > 0) errors.push("TermClassification.data.duplicatedColumn")
        const duplicatedTermsBetweenColumns = this.functions.getDuplicatedTerms(this.data);
        if (duplicatedTermsBetweenColumns.length > 0) errors.push("TermClassification.data.duplicatedTerms")
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }
}
