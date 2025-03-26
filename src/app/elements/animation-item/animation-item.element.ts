import prev from "./prev.hbs";
import './styles.scss';
import icon from "./icon.png";
import { InputWidgetAnimationItemData, WidgetAnimationItemData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import SpecificItemElement from "../specific-item/specific-item.element";

export default class AnimationItemElement extends HasFilePickerElement(SpecificItemElement) {

    static widget = "AnimationItem";
    static icon = icon;
    data: WidgetAnimationItemData;

    constructor() { super(); }

    async init(values?: InputWidgetAnimationItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { image: "" };
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                image: this.data.image
            }));
    }

    get preview() { return this.data?.image ? prev(this.data) : this.translate("widgets.AnimationItem.prev"); }

    get texts() { return {}; }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        this.initFilePicker($form.find('input[name="image"]'));
    }

    updateModelFromForm(form: any): void {
        this.data.image = form.image;
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    set texts(texts: any) { }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!this.utils.isValidResource(this.data.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (!this.utils.isValidResource(form.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }
}
