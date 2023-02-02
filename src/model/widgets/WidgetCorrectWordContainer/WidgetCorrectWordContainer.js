import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetCorrectWordContainer extends WidgetContainerElement {

    static widget = "CorrectWord";
    static type = "specific-element-container";
    static label = "Correct word";
    static allow = ["CorrectWordItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAvVBMVEUAAAAeN1YeN1Z4h5ovRmI3TGgjPFp4h5oeN1Z4h5ooQF54h5p4h5p4h5ozSmZ4h5omPlwqQV8eN1Z4h5oeN1Z4h5oeN1b///8eN1Z4h5qOm6rHzdVWaIA9Um3+4Or5DVz9wtbx8vQrQ2BygpX5HWf8jrP7XpJHXHX7Tof6LXLj5ur+0eDV2d+4wMqAjqDsdp3vPXg5T2r9vtSqtL+cp7X9rsn7bp1jdIr/7/T+z979nr78fqhcboX6PX1GWnQ8cNfCAAAAF3RSTlMAQIDA0BD3QDDw65go4NzQppBwYGBQIGoLbbUAAAF/SURBVEjH1dT7V4IwFAdwKt/a+7GLGLiBA0woFB9p9f//WW1AYx3H1m/V13N2ED5e7+XALJbeqSF3besr15BN9IFBr7KnkCBDcNipandyZAzObgp7Arg+lyRYrdNWhcWZOQEgaj0+wg6wOAYskhKS1v+jx3KwDysZX3TbjRiHADCW8KPdv23ACwI8PpawbXcLLEw1XUKgTIhlPJTxipR95iCSyfhMwmNgSRHyQYoSC7OdwA+wuP6PMFFZ0oAXRGEXR1iXP42fptOpq1pU+MXzvGfV8osD+uLVXuqwu2ET5SFChxn/RiO3GbsxM5g4rGSwRq/xQdfG+4ZfmfDDWcA+up4pZQuuHp/I2zcNyHvbx3z1fVRWjmJXiVl7FLnBmu9xMC/tElGm1ZUp3UT8YJsWt6z4IY2aeo6Cok6xZ7n1bDJ+EDvybiffQ/Qt4UeBrVaIkSkr2Ja418lyR5vEh9AusdW+GoA+2ZtdYhHbFBlfGvGwxl2T7Y+sOvfn+iZG1idv5LZVG7+gBgAAAABJRU5ErkJggg==";
    static cssClass = "widget-correct-word";

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: WidgetCorrectWordContainer.label + "-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetCorrectWordContainer(this);
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetCorrectWordContainer.label + "-" + Utils.generate_uuid();
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }
            
            return {
                inputs: form(data),
                title: this.translate("widgets.CorrectWord.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.CorrectWord.label");
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var errors = [];
        if (this.data.length == 0) errors.push("CorrectWord.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}
