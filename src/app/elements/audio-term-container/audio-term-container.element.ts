import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAudioTermContainerData, WidgetAudioTermContainerParams, WidgetInitOptions } from '../../../types';
import ContainerSpecificElement from '../container-specific/container-specific.element';
import AudioTermItemElement from '../audio-term-item/audio-term-item.element';

export default class AudioTermContainerElement extends ContainerSpecificElement {

    static widget = "AudioTermContainer";
    static category = "interactiveElements";
    static icon = icon;
    params: WidgetAudioTermContainerParams;
    data: AudioTermItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetAudioTermContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Audio Term Container-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Audio Term Container-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) as AudioTermItemElement[] : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview() { return this.params?.name ?? this.title; }

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
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}