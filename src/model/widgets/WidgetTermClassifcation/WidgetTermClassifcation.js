import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetTermClassification extends WidgetContainerElement {
    
    static widget = "TermClassification";
    static type = "specific-element-container";
    static allow = ["TermClassificationItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAnFBMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///8eN1Z4h5qOm6pWaIBhc4nHzdX5DVz6KnDx8vTj5ur8hq39wtb9pMKqtL/8dqP7Z5lygpU5T2v3GGQ0Mlf/8PX+4ev+0eD6SYRPY3tHXHW4wMqcp7WAjqD7WI7UJ2iTKF5HL1d5YSg4AAAAEnRSTlMAQECA/jD34NBgELqmoJeAcDCW+Nc0AAABIElEQVRIx83U23KCMBCA4ZgCWnvOJoBBQLB46rl9/3drgGiQTtm90fG/ysU3TFhCWB0f7om5rgJACq739tZ7T8Rg8w+wmsObQFPBtN3Eq8BLgLc4FITOjNWh7voIz+Mmg0HZoLeOxg8Wq+fQBDUWNuitIynvLFbChGHpH+HZn9IuHpGf7LDbM47dNHC87wR4ETbRsFrGJqDg/pzTA84txue8/tZ6Q9vGqqi+MtoLbstZuaWNLttVxYo251zrdD0wjVg11VtNtc6R0YXtD7Epql1GnfNn+YN8FOQ8n/Pw41eBw/gl4zDaxWHSzW8xhxjHyls2mN14iwR5roIX2WJ2D1iesRazKTc9Rv9noMU2X6I5zCaYHTOXP0Gsz7qNBjPgFwmdi7gk6W/UAAAAAElFTkSuQmCC";
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
