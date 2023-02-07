import prev from "./prev.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetAnimationItem extends WidgetItemElement {

    static widget = "AnimationItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-animation-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { image: ""};
    }

    clone() {
        return new WidgetAnimationItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                image: this.data?.image ?? ''
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.AnimationItem.label")
            };
        });
    }

    preview() {
        return this.data?.image ? prev(this.data) : this.translate("widgets.AnimationItem.prev");
    }

    updateModelFromForm(form) {
        this.data.image = form.image;
    }

    validateModel() {
        var errors = [];
        if (!Utils.isIndieResource(this.data.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationItem.image.invalid");
        return errors;
    }

}
