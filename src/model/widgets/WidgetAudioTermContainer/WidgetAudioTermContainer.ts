import Utils from '../../../Utils';
import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';
import ModelManager from '../../ModelManager';
import icon from "./icon.png";
import WidgetAudioTermItem from '../WidgetAudioTermItem/WidgetAudioTermItem';
import { FormEditData } from '../../../types';

export default class WidgetAudioTermContainer extends WidgetContainerElement {

    static widget = "AudioTermContainer";
    static type = "specific-element-container";
    static allow = ["AudioTermItem"];
    static category = "interactiveElements";
    static icon = icon;
    params: { name: string, help: string };
    data: WidgetAudioTermItem[];

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Audio Term Container-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone(): WidgetAudioTermContainer {
        return new WidgetAudioTermContainer(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.AudioTermContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.AudioTermContainer.label");
    }

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = "Audio Term Container-" + this.id;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("AudioTermContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}