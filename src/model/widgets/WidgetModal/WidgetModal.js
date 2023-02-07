import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetModal extends WidgetContainerElement {
    
    static widget = "Modal";
    static type = "simple-container";
    static allow = ["element"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-modal-container";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetModal.widget + "-" + Utils.generate_uuid(),
            text: "",
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetModal(this);
    }
    
    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                instanceName: this.params.name,
                text: this.params.text,
                help: this.params.help
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.SchemaContainer.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.Modal.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetModal.widget + "-" + this.id;
    }


    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.text = form.text;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0) keys.push("Modal.data.empty");
        if (this.params.text.length == 0) keys.push("Modal.text.invalid");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.text.length == 0) keys.push("Modal.text.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
