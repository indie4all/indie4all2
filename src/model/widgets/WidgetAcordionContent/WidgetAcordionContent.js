import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';
import ModelManager from '../../ModelManager';
import icon from "./icon.png";

export default class WidgetAcordionContent extends WidgetContainerElement {
    
    static widget = "AcordionContent";
    static type = "element-container";
    static allow = ["element", "layout", "specific-element-container"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-acordion-content";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { title: ""};
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAcordionContent(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = { instanceId: this.id, title: this.params.title ?? '' };
            return {
                inputs: form(data),
                title: this.translate("widgets.AcordionContent.label")
            };
        });
    }

    preview() {
        return this.translate("widgets.AcordionContent.label") + " " + (this.params?.title ?? "");
    }

    updateModelFromForm(form) {
        this.params.title = form.title;
    }

    validateModel() {
        var errors = [];
        if (this.params.title.length == 0) errors.push("AcordionContent.title.invalid");
        if (this.data.length == 0) errors.push("AcordionContent.data.empty");
        return errors;
    }

    validateForm(form) {
        if (form.title.length == 0)
            return ["AcordionContent.title.invalid"]
        return [];
    }
}