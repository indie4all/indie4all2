import Utils from "../../../Utils.js"
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement.js";
import ModelManager from '../../ModelManager';
import icon from "./icon.png";

export default class WidgetAcordionContainer extends WidgetContainerElement {

    static widget = "AcordionContainer";
    static type = "specific-container";
    static allow = ["AcordionContent"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-acordeon-container";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Acordion-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAcordionContainer(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.AcordionContainer.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.AcordionContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Acordion-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0)
            keys.push("AcordionContainer.data.empty");
        if (!Utils.hasNameInParams(this))
            keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }
}
