import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetButtonTextContainer extends WidgetContainerElement {

    static widget = "ButtonTextContainer";
    static type = "specific-element-container";
    static allow = ["ButtonTextItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-button-text";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Buttons with text-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetButtonTextContainer(this);
    }

    getInputs() {

        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.ButtonTextContainer.label")
            }
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.ButtonTextContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Buttons with text-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var errors = [];
        if (this.data.length == 0) errors.push("ButtonTextContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(formData) {
        var keys = [];
        if (formData.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
