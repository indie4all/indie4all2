import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";

export default class WidgetDragdropContainer extends WidgetContainerElement  {

    static widget = "DragdropContainer";
    static type = "specific-element-container";
    static allow = ["DragdropItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-dragdrop-container";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Drag And Drop-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetDragdropContainer(this);
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
                title: this.translate("widgets.DragdropContainer.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.DragdropContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Drag And Drop-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0) keys.push("DragdropContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}