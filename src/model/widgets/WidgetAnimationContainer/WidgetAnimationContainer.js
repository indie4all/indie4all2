import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetAnimationContainer extends WidgetContainerElement {

    static widget = "AnimationContainer";
    static type = "specific-element-container";
    static allow = ["AnimationItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC3klEQVRoge2ZT2jTUBzHvw1z4rp1HXTKQNKhTFlhIIpk+Id1F/+DG8zMy5jiKEwv7UVbEWZP7a3z4qFMZAjiuh289LDTNr1sDkQYVJgHuyB4mLC/7iIa+YWmVvNS01qTdvQDgeS9l5dPwnu/l/eeDTnwgngMQA+sJQ3gpbSQWNezyErzghgD4D/Y0gw6rGL+bQoZ8V5pIfFOV4MXxIe8IMrTc29kq9nY2pYvDNyVeUFc4wXRmU967cmLpOXCKiR+qucOiftZvhwviF4Azr7LXRY35V846u0413WSrq+y8jn1hAqWE415fLiyMjVIVbrU7K3d4wxG4t5gJP5bFClraaejnga7GQAfg5H4DTW9UpoHfemn9NVRgW16EBUo3YpKjR41fybISyv4dvqBtuBzP7grJ5Tz1Ic0wrHxvBV7jrRixD+YvZ5KzmEyOZv3nonHI8VJY2OHWVBekoCM9ObWjvo3ZphPn1cLvse4tAE6j3uwMj+RLUgy/bfDCAxdg3+oj1kBpefmGblHj93RpsE3gzvbrkm2dfAmKf0djbSNd6Emeb9sBFkU1ab1iI1NKsf/piTSjoY6pXOyoA7naLDD0+Zm5hczHy2JtKetVTfGujv7FWGjMdgIu2RElL7g+3BcU5AbPp8dEa1G2zykVfx4/V6TbDvTnh0RrWaXDC5FMjo2pRvuKIJQh8yFOqZexClcurGOXVIvPQOFrkIkKEwWi3ZE7HCjdvNZwdXRYo9ZCz7VJQSzqEqbRVXaLKrSZsFlNmVKNr0vFdOvFmGv28esjZMWEiQ9Gx4dx+b217IQpoWd1HIah/gWZr46jAdSy+mZiwP3nLeuX1JmIlZAH216blGRPnqYx35XE9Midx+RllNpL9GrLvRZwQFXkyKsM3ecjYZ83dkfpswO6U1WyWAkLlv1EiyMRg/9nVNzUTyMSgfKQJhawiMYlY6GfLRG26uGRwug53dHQz6rnv+PAPgJZGTQLIzxpiAAAAAASUVORK5CYII=";
    static cssClass = "widget-animation-container";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Animation-" + Utils.generate_uuid(),
            width: 0,
            height: 0,
            image: "",
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAnimationContainer(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
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

    preview() {
        return this.params?.name ?? this.translate("widgets.AnimationContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Animation-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.width = parseInt(form.width);
        this.params.height = parseInt(form.height);
        this.params.image = form.image;
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateForm(form) {
        var errors = [];
        if (form.width <= 0) errors.push("AnimationContainer.width.invalid");
        if (form.height <= 0) errors.push("AnimationContainer.height.invalid");
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationContainer.image.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }

    validateModel() {
        var errors = [];
        if (!this.params.width > 0) errors.push("AnimationContainer.width.invalid");
        if (!this.params.height > 0) errors.push("AnimationContainer.height.invalid");
        if (!Utils.isIndieResource(this.params.image)) errors.push("AnimationContainer.image.invalid");
        if (this.data.length == 0) errors.push("AnimationContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }
}