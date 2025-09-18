import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetImageAndSoundContainerData, WidgetImageAndSoundContainerParams, WidgetInitOptions } from "../../../types";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import ImageSoundItemElement from "../image-sound-item/image-sound-item.element";

export default class ImageSoundContainerElement extends ContainerSpecificElement {

    static widget = "ImageAndSoundContainer";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageAndSoundContainerParams;
    data: ImageSoundItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetImageAndSoundContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Sound-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Image and Sound-" + this.id
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) as ImageSoundItemElement[] : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }));
    }

    get preview(): string {
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
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
