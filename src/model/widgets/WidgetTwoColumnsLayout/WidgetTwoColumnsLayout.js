/* global $ */
import './styles.scss';
import WidgetColumnsLayout from "../WidgetColumnsLayout/WidgetColumnsLayout";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetTwoColumnsLayout extends WidgetColumnsLayout {
    
    static widget = "TwoColumnsLayout";
    static type = "layout";
    static allow = ["element", "specific-element-container"];
    static category = "layouts";
    static toolbar = { edit: true };
    static icon = icon;
    static columns = [6, 6];

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { firstColumnWidth: 6};
        this.data = values?.data ? values.data.map(arr => arr.map(elem => ModelManager.create(elem.widget, elem))) : [[],[]];
    }

    clone() {
        return new WidgetTwoColumnsLayout(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                width: this.params.firstColumnWidth
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.ColumnLayout.label")
            }
        });
    }

    settingsClosed() {
        const width = $('#column-layout-width-1').val();
        const $container = $(`[data-id="${this.id}"]`).find('.row');
        const $firstColumn = $container.children().eq(0);
        const $secondColumn = $container.children().eq(1);
        $firstColumn.removeClass().addClass(`col-md-${width}`);
        $secondColumn.removeClass().addClass(`col-md-${12 - width}`);
    }

    updateModelFromForm(form) {
        this.params.firstColumnWidth = form.width;
    }

    validateModel() {
        const errors = [];
        const emptyElement = this.data.find(elem => elem.length == 0);
        if (emptyElement) errors.push("ColumnLayout.data.empty");
        const width = this.params?.firstColumnWidth;
        if ( !/^\d{1,2}$/.test(width) || parseInt(width) < 1 || parseInt(width) > 11)
            errors.push("ColumnLayout.width.invalid");
        return errors;
    }

    validateForm(form) { 
        if ( !/^\d{1,2}$/.test(form.width) || parseInt(form.width) < 1 || parseInt(form.width) > 11)
            return ["ColumnLayout.width.invalid"]
        return []; 
    }
}