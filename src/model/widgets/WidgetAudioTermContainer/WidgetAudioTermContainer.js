import Utils from '../../../Utils';
import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';
import ModelManager from '../../ModelManager';
import icon from "./icon.png";

export default class WidgetAudioTermContainer extends WidgetContainerElement {

    static widget = "AudioTermContainer";
    static type = "specific-element-container";
    static allow = ["AudioTermItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Audio Term Container-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAudioTermContainer(this);
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
                title: this.translate("widgets.AudioTermContainer.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.AudioTermContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Audio Term Container-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0) keys.push("AudioTermContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}