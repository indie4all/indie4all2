import form from "./form.hbs"
import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class AnimationContainer extends WidgetContainerElement {
    config = {
        widget: "AnimationContainer",
        type: "specific-element-container",
        label: "Animation",
        allow: ["AnimationItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC3klEQVRoge2ZT2jTUBzHvw1z4rp1HXTKQNKhTFlhIIpk+Id1F/+DG8zMy5jiKEwv7UVbEWZP7a3z4qFMZAjiuh289LDTNr1sDkQYVJgHuyB4mLC/7iIa+YWmVvNS01qTdvQDgeS9l5dPwnu/l/eeDTnwgngMQA+sJQ3gpbSQWNezyErzghgD4D/Y0gw6rGL+bQoZ8V5pIfFOV4MXxIe8IMrTc29kq9nY2pYvDNyVeUFc4wXRmU967cmLpOXCKiR+qucOiftZvhwviF4Azr7LXRY35V846u0413WSrq+y8jn1hAqWE415fLiyMjVIVbrU7K3d4wxG4t5gJP5bFClraaejnga7GQAfg5H4DTW9UpoHfemn9NVRgW16EBUo3YpKjR41fybISyv4dvqBtuBzP7grJ5Tz1Ic0wrHxvBV7jrRixD+YvZ5KzmEyOZv3nonHI8VJY2OHWVBekoCM9ObWjvo3ZphPn1cLvse4tAE6j3uwMj+RLUgy/bfDCAxdg3+oj1kBpefmGblHj93RpsE3gzvbrkm2dfAmKf0djbSNd6Emeb9sBFkU1ab1iI1NKsf/piTSjoY6pXOyoA7naLDD0+Zm5hczHy2JtKetVTfGujv7FWGjMdgIu2RElL7g+3BcU5AbPp8dEa1G2zykVfx4/V6TbDvTnh0RrWaXDC5FMjo2pRvuKIJQh8yFOqZexClcurGOXVIvPQOFrkIkKEwWi3ZE7HCjdvNZwdXRYo9ZCz7VJQSzqEqbRVXaLKrSZsFlNmVKNr0vFdOvFmGv28esjZMWEiQ9Gx4dx+b217IQpoWd1HIah/gWZr46jAdSy+mZiwP3nLeuX1JmIlZAH216blGRPnqYx35XE9Midx+RllNpL9GrLvRZwQFXkyKsM3ecjYZ83dkfpswO6U1WyWAkLlv1EiyMRg/9nVNzUTyMSgfKQJhawiMYlY6GfLRG26uGRwug53dHQz6rnv+PAPgJZGTQLIzxpiAAAAAASUVORK5CYII=",
        cssClass: "widget-animation-container"
    }

    paletteHidden = true

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                width: 0,
                height: 0,
                image: "",
                help: ""
            },
            data: []
        };
    }

    getInputs(model) {
        return {
            inputs: form({
                width: model.params.width,
                height: model.params.height,
                image: model.params.image,
                id: model.id,
                instanceName: model.params.name,
                help: model.params.help
            }),
            title: this.translate("widgets.AnimationContainer.label")
        };
    }

    hasChildren() { return true; }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.AnimationContainer.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.width = parseInt(form.width);
        model.params.height = parseInt(form.height);
        model.params.image = form.image;
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateForm(form) {
        var errors = [];
        if (form.width <= 0) errors.push("AnimationContainer.width.invalid");
        if (form.height <= 0) errors.push("AnimationContainer.height.invalid");
        if (!Utils.isIndieResource(form.image)) errors.push("AnimationContainer.image.invalid");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        return errors;
    }

    validateModel(model) {
        var errors = [];
        if (!model.params.width > 0) errors.push("AnimationContainer.width.invalid");
        if (!model.params.height > 0) errors.push("AnimationContainer.height.invalid");
        if (!Utils.isIndieResource(model.params.image)) errors.push("AnimationContainer.image.invalid");
        if (model.data.length == 0) errors.push("AnimationContainer.data.empty");
        if (!Utils.hasNameInParams(model)) errors.push("common.name.invalid");
        return errors;
    }
}