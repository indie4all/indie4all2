import Utils from "../../../Utils";
import './styles.scss';
import icon from "./icon.png";
import WidgetAnimationItem from "../WidgetAnimationItem/WidgetAnimationItem";
import { FormEditData, InputWidgetAnimationContainerData, WidgetAnimationContainerParams } from "../../../types";
import WidgetContainerSpecificElement from "../WidgetContainerSpecificElement/WidgetContainerSpecificElement";

export default class WidgetAnimationContainer extends WidgetContainerSpecificElement {

    static widget = "AnimationContainer";
    static icon = icon;
    params: WidgetAnimationContainerParams;
    data: WidgetAnimationItem[];

    static async create(values?: InputWidgetAnimationContainerData): Promise<WidgetAnimationContainer> {
        const container = new WidgetAnimationContainer(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => WidgetAnimationItem.create(elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetAnimationContainerData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Animation-" + this.id,
            width: 0,
            height: 0,
            image: "",
            help: ""
        };
    }

    clone(): WidgetAnimationContainer {
        const widget = new WidgetAnimationContainer();
        widget.params = structuredClone(this.params);
        widget.params.name = "Animation-" + widget.id;
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    getInputs(): Promise<FormEditData> {
        return import('./form.hbs').then(({ default: form }) => {
            return {
                inputs: form({
                    width: this.params.width,
                    height: this.params.height,
                    image: this.params.image,
                    id: this.id,
                    instanceName: this.params.name,
                    help: this.params.help
                }),
                title: this.translate("widgets.AnimationContainer.label")
            };
        });
    }

    preview(): string {
        return this.params?.name ?? this.translate("widgets.AnimationContainer.label");
    }

    updateModelFromForm(form: any): void {
        this.params.width = parseInt(form.width);
        this.params.height = parseInt(form.height);
        this.params.image = form.image;
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.width <= 0) errors.push("AnimationContainer.width.invalid");
        if (form.height <= 0) errors.push("AnimationContainer.height.invalid");
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationContainer.image.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.width <= 0) errors.push("AnimationContainer.width.invalid");
        if (this.params.height <= 0) errors.push("AnimationContainer.height.invalid");
        if (!Utils.isIndieResource(this.params.image)) errors.push("AnimationContainer.image.invalid");
        if (this.data.length == 0) errors.push("AnimationContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }
}