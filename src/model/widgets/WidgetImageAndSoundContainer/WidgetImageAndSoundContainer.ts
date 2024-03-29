import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import WidgetImageAndSoundItem from "../WidgetImageAndSoundItem/WidgetImageAndSoundItem";
import { FormEditData, InputWidgetImageAndSoundContainerData, WidgetImageAndSoundContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";
import ModelManager from "../../../model/ModelManager";

export default class WidgetImageAndSoundContainer extends WidgetContainerSpecificElement {

    static widget = "ImageAndSoundContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageAndSoundContainerParams;
    data: WidgetImageAndSoundItem[];

    static async create(values?: InputWidgetImageAndSoundContainerData): Promise<WidgetImageAndSoundContainer> {
        const container = new WidgetImageAndSoundContainer(values);
        container.data = values?.data ? await Promise.all(
            values.data.map(elem => ModelManager.create(elem.widget, elem))) as WidgetImageAndSoundItem[] : [];
        return container;
    }

    constructor(values?: InputWidgetImageAndSoundContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Sound-" + this.id,
            help: ""
        };
    }

    clone(): WidgetImageAndSoundContainer {
        const widget = new WidgetImageAndSoundContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Image and Sound-" + widget.id;
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
            title: this.translate("widgets.ImageAndSoundContainer.label")
        };
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.ImageAndSoundContainer.label");
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
        var errors: string[] = [];
        if (this.data.length == 0) errors.push("ImageAndSoundContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
