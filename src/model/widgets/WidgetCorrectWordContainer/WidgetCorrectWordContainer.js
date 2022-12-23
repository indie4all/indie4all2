import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class WidgetCorrectWordContainer extends WidgetContainerElement {
    config = {
        widget: "CorrectWord",
        type: "specific-element-container",
        label: "Correct word",
        allow: ["CorrectWordItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAvVBMVEUAAAAeN1YeN1Z4h5ovRmI3TGgjPFp4h5oeN1Z4h5ooQF54h5p4h5p4h5ozSmZ4h5omPlwqQV8eN1Z4h5oeN1Z4h5oeN1b///8eN1Z4h5qOm6rHzdVWaIA9Um3+4Or5DVz9wtbx8vQrQ2BygpX5HWf8jrP7XpJHXHX7Tof6LXLj5ur+0eDV2d+4wMqAjqDsdp3vPXg5T2r9vtSqtL+cp7X9rsn7bp1jdIr/7/T+z979nr78fqhcboX6PX1GWnQ8cNfCAAAAF3RSTlMAQIDA0BD3QDDw65go4NzQppBwYGBQIGoLbbUAAAF/SURBVEjH1dT7V4IwFAdwKt/a+7GLGLiBA0woFB9p9f//WW1AYx3H1m/V13N2ED5e7+XALJbeqSF3besr15BN9IFBr7KnkCBDcNipandyZAzObgp7Arg+lyRYrdNWhcWZOQEgaj0+wg6wOAYskhKS1v+jx3KwDysZX3TbjRiHADCW8KPdv23ACwI8PpawbXcLLEw1XUKgTIhlPJTxipR95iCSyfhMwmNgSRHyQYoSC7OdwA+wuP6PMFFZ0oAXRGEXR1iXP42fptOpq1pU+MXzvGfV8osD+uLVXuqwu2ET5SFChxn/RiO3GbsxM5g4rGSwRq/xQdfG+4ZfmfDDWcA+up4pZQuuHp/I2zcNyHvbx3z1fVRWjmJXiVl7FLnBmu9xMC/tElGm1ZUp3UT8YJsWt6z4IY2aeo6Cok6xZ7n1bDJ+EDvybiffQ/Qt4UeBrVaIkSkr2Ja418lyR5vEh9AusdW+GoA+2ZtdYhHbFBlfGvGwxl2T7Y+sOvfn+iZG1idv5LZVG7+gBgAAAABJRU5ErkJggg==",
        cssClass: "widget-correct-word"
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: ""
            },
            data: []
        };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help
        }
        
        return {
            inputs: form(data),
            title: this.translate("widgets.CorrectWord.label")
        };
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.CorrectWord.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.length == 0) errors.push("CorrectWord.data.empty");
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}
