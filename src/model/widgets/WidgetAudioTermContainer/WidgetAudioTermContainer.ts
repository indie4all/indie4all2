import Utils from '../../../Utils';
import './styles.scss';
import icon from "./icon.png";
import WidgetAudioTermItem from '../WidgetAudioTermItem/WidgetAudioTermItem';
import { FormEditData, InputWidgetAudioTermContainerData, WidgetAudioTermContainerParams } from '../../../types';
import WidgetContainerSpecificElement from '../WidgetContainerSpecificElement/WidgetContainerSpecificElement';
import ModelManager from "../../../model/ModelManager";

export default class WidgetAudioTermContainer extends WidgetContainerSpecificElement {

    static widget = "AudioTermContainer";
    static category = "interactiveElements";
    static icon = icon;
    params: WidgetAudioTermContainerParams;
    data: WidgetAudioTermItem[];

    static async create(values?: InputWidgetAudioTermContainerData): Promise<WidgetAudioTermContainer> {
        const container = new WidgetAudioTermContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) as WidgetAudioTermItem[] : [];
        return container;
    }

    constructor(values?: InputWidgetAudioTermContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Audio Term Container-" + this.id,
            help: ""
        };
    }

    clone(): WidgetAudioTermContainer {
        const widget = new WidgetAudioTermContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Audio Term Container-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
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

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
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