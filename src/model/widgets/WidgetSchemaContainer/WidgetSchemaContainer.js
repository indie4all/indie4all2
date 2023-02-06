import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetSchemaContainer extends WidgetContainerElement {

    static widget = "SchemaContainer";
    static type = "specific-element-container";
    static allow = ["SchemaItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC30lEQVRogWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYEg6moVSAz59+cpw7dZDnPKUFKHsbKwCFe2zQHnuQkdlGrzcptjRxc3TGXYdPI1T3sJIi2HltHqyzBbg4wFVdvsZGBg+VLTPKuyoTFvAQI3k8enzV0qNIAaAyuv50FAfcmk6noEaySPU2wGFD6qGQUkCBiyNtCm1AhkoMFDD0aBKCblikrcIJzsNEwtGy2l6gZFVueCrVKBtYhRAzXY6WY5es/UgQ3HzNJzy4VmNWMWTIrwY6gviybESBZCVPFZvPUCWZdduPSBLHzoYzYj0AmQ5mtxabkAzYkFKCEpVjQxAmRBXjYhLD6mA7CIPnwOo5ThcYDQj0guQljw+fmP4276O4f/lRziVLHnIyvDHuw2nPKOuHANTlgcDo5wI2V4kydF/Mmcx/NtyFq8acwZGhn+Hr+NWcPg62NMsW6tIsRoFkJY8Pn4j2yJkgNdTRIDRjEgvQJqjKcg8yIDJx5gi/SRlRJbpaQx/deUpS9v8XAzM0bbk6yenRmTOcqfIQmqA0YxILzBkHQ3uA2HrjA4k2HnoNAM3Fyd2Rz86uQrk6AONExaCe9iDAYA6zqD+pJKcJFbXwEqPwmu3Huz3jC0XSI7wYtBSVRgQp4MCbefB02BHqyvLMYiJCGJVhzyPCBpOBc0lOsAG+gYCiIsIgh2Mo2t2oKMyzRFeTkNnSBOxqaxon/V/oDyBDRBbeuCeOaUvALuDWEcXDgIHg1LCRAZiHd1RmQYaUgqEFY8DAED2O3ZUpg2U/RQCBgYGAKY1zxwwyX/HAAAAAElFTkSuQmCC";
    static cssClass = "widget-schema-container";

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: "Schema-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetSchemaContainer(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }
            return {
                inputs: form(data),
                title: this.translate("widgets.SchemaContainer.label")
            }
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.SchemaContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Schema-" + Utils.generate_uuid();
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0) keys.push("SchemaContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }
    
}