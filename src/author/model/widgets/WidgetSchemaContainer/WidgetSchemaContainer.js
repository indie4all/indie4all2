import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class WidgetSchemaContainer extends WidgetContainerElement {
    config = {
        widget: "SchemaContainer",
        type: "specific-element-container",
        label: "Schema",
        allow: ["SchemaItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC30lEQVRogWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYEg6moVSAz59+cpw7dZDnPKUFKHsbKwCFe2zQHnuQkdlGrzcptjRxc3TGXYdPI1T3sJIi2HltHqyzBbg4wFVdvsZGBg+VLTPKuyoTFvAQI3k8enzV0qNIAaAyuv50FAfcmk6noEaySPU2wGFD6qGQUkCBiyNtCm1AhkoMFDD0aBKCblikrcIJzsNEwtGy2l6gZFVueCrVKBtYhRAzXY6WY5es/UgQ3HzNJzy4VmNWMWTIrwY6gviybESBZCVPFZvPUCWZdduPSBLHzoYzYj0AmQ5mtxabkAzYkFKCEpVjQxAmRBXjYhLD6mA7CIPnwOo5ThcYDQj0guQljw+fmP4276O4f/lRziVLHnIyvDHuw2nPKOuHANTlgcDo5wI2V4kydF/Mmcx/NtyFq8acwZGhn+Hr+NWcPg62NMsW6tIsRoFkJY8Pn4j2yJkgNdTRIDRjEgvQJqjKcg8yIDJx5gi/SRlRJbpaQx/deUpS9v8XAzM0bbk6yenRmTOcqfIQmqA0YxILzBkHQ3uA2HrjA4k2HnoNAM3Fyd2Rz86uQrk6AONExaCe9iDAYA6zqD+pJKcJFbXwEqPwmu3Huz3jC0XSI7wYtBSVRgQp4MCbefB02BHqyvLMYiJCGJVhzyPCBpOBc0lOsAG+gYCiIsIgh2Mo2t2oKMyzRFeTkNnSBOxqaxon/V/oDyBDRBbeuCeOaUvALuDWEcXDgIHg1LCRAZiHd1RmQYaUgqEFY8DAED2O3ZUpg2U/RQCBgYGAKY1zxwwyX/HAAAAAElFTkSuQmCC",
        cssClass: "widget-schema-container"
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
        const data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.SchemaContainer.label")
        }
    }

    hasChildren() { return true; }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.SchemaContainer.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var keys = [];
        if (widget.data.length == 0) keys.push(" SchemaContainer.data.empty");
        if (!Utils.hasNameInParams(widget)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }
    
}