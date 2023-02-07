import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetTabContent extends WidgetContainerElement {
    
    static widget = "TabContent";
    static type = "element-container";
    static allow = ["element", "layout", "specific-element-container"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-tab-content";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { name: "" };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
        this.skipNameValidation = true;
    }

    clone() {
        return new WidgetTabContent(this);
    }


    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                name: this.params ? this.params.name : ''
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.TabContent.label")
            };
        });
    }

    preview() {
        return this.translate("widgets.TabContent.label") + " " + (this.params?.name ?? "");
    }

    updateModelFromForm(form) {
        this.params.name = form.name;
    }

    validateModel() {
        var errors = [];
        if (!Utils.hasNameInParams(this)) errors.push("TabContent.name.invalid");
        if (this.data.length == 0) errors.push("TabContent.data.empty");
        return errors;
    }

    validateForm(form) {
        if (form.name.length == 0)
            return ["TabContent.name.invalid"]
        return [];
    }
}