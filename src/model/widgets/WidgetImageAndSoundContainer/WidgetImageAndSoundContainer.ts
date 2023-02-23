import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetImageAndSoundItem from "../WidgetImageAndSoundItem/WidgetImageAndSoundItem";
import { FormEditData } from "../../../types";

export default class WidgetImageAndSoundContainer extends WidgetContainerElement {

    static widget = "ImageAndSoundContainer";
    static type = "specific-element-container";
    static allow = ["ImageAndSoundItem"];
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-image-and-sound-container";

    params: { name: string, help: string };
    data: WidgetImageAndSoundItem[];

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Sound-" + this.id,
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
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
