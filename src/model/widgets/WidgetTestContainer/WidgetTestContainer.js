import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetTestContainer extends WidgetContainerElement {

    static widget = "Test";
    static type = "specific-element-container";
    static allow = ["GapQuestion", "SimpleQuestion", "TrueFalseQuestion"];
    static category = "exerciseElement";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-test";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetTestContainer.widget + "-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetTestContainer(this);
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
                title: this.translate("widgets.Test.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.Test.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetTestContainer.widget + "-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0) keys.push("Test.data.empty")
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}