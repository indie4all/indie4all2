import form from './form.hbs'
import Utils from '../../../Utils';
import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';
import ModelManager from '../../ModelManager';

export default class WidgetAudioTermContainer extends WidgetContainerElement {

    static widget = "AudioTermContainer";
    static type = "specific-element-container";
    static label = "Audio Term Container";
    static allow = ["AudioTermItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACuUlEQVRogWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghfQCv/hiGf54t+G1jR+Pe5hwygxiQFNH/z9yneH/5YdgNjGhSyygqaN/e7Ux/K1YilcNPs+ws7EKVLTPcqhon4VSilDd0ZSEKLpeAT4eUGW3n4GB4X5F+6wEmDgLukZQdP62rsFrOOvRFgZGXXmyHEYmAIX0/Ir2WQ86KtMOYIb0x2+EjUVTAwodaqVXAiCeYQiWHgoM2JIHKNqZK4Pw6kRPGixbq6juOnwAw9EM/FwMzJWBdHUEqQDT0RQCtk+LyTaAWL1UdzQyYN1WBY45fIAcT9LU0Yw2mnA2JTGADoZk24OmIY0LUBrqwyekof00nMDCSIuebsQAGI4GOTg8qwGvppXTGjAcTsijxAA+Xi4GLVUF0h0NAf9JtjA8q5FiR4MCYuW0eoLqcDiaEbswHkCMZYQAKKSJARiOhvgWf/LAlqbpmc6xhvRAZzRCYLRjSy8w6mh6gdEakVIwWiMSA0ZrRAJgtEakF2CCTspQJfdTE+w8dJqBm4sTq4lMj06uAjn6QOOEhQyfvnwdFA5es/Ugw7VbDxiU5CSxysPSdOG1Ww/2e8aWCyRHeBFVVtICgAJt58HTYEerK8sxiIkIYrUFeR4RNJwKmkt0gA30DQQQFxEEOxjHXOaBjso0R3jpAZ0hTcSmsqJ9Fum1DQ0BsaUH7plT+gKwO4h1dOEgcDAoJUxkINbRoCkD0Fw1rHgcAACy37GjMm2g7KcQMDAwAADM09jiVfIvDQAAAABJRU5ErkJggg==";

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: WidgetAudioTermContainer.label + "-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAudioTermContainer(this);
    }

    getInputs() {
        var data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.AudioTermContainer.label")
        };
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.AudioTermContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetAudioTermContainer.label + "-" + Utils.generate_uuid();
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