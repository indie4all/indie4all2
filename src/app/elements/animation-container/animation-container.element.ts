import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAnimationContainerData, WidgetAnimationContainerParams, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import ContainerSpecificElement from "../container-specific/container-specific.element";
import AnimationItemElement from "../animation-item/animation-item.element";

export default class AnimationContainerElement extends HasFilePickerElement(ContainerSpecificElement) {

    protected static _generable = false;
    static widget = "AnimationContainer";
    static icon = icon;
    params: WidgetAnimationContainerParams;
    data: AnimationItemElement[];

    constructor() { super(); }

    async init(values?: InputWidgetAnimationContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Animation-" + this.id,
            width: 0,
            height: 0,
            image: "",
            help: ""
        };
        if (options.regenerateId) this.params.name = "Animation-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(async elem =>
            this.create(AnimationItemElement.widget, elem, options) as Promise<AnimationItemElement>
        )) : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                width: this.params.width,
                height: this.params.height,
                image: this.params.image,
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

    settingsOpened() {
        const $form = $('#f-' + this.id);
        this.initFilePicker($form.find('input[name="image"]'));
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
        if (!this.utils.isValidResource(form.image)) errors.push("AnimationContainer.image.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.width <= 0) errors.push("AnimationContainer.width.invalid");
        if (this.params.height <= 0) errors.push("AnimationContainer.height.invalid");
        if (!this.utils.isValidResource(this.params.image)) errors.push("AnimationContainer.image.invalid");
        if (this.data.length == 0) errors.push("AnimationContainer.data.empty");
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }
}