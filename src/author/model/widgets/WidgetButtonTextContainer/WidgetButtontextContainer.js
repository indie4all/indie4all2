import form from "./form.hbs";
import palette from "./palette.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";
import "./styles.scss";

export default class WidgetButtonTextContainer extends WidgetElement {
    config = {
        widget: "ButtonTextContainer",
        type: "specific-element-container",
        label: "Buttons with text",
        allow: ["ButtonTextItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1YeN1Z4h5owR2MjPFp4h5oeN1YeN1Z4h5ooQF5OYXl4h5ozSmZ4h5orQ2AmPlx4h5p4h5oqQV8eN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1b5DVz8hq2Om6pWaIDHzdU9Um39wtbcZo3rOXTx8vQ4Tmq4wMpygpVHXHWqtL/+4evj5urV2d/9pMKcp7X7Z5lecIf6SYT5G2aAjqBGWnQqQl/wyqdVAAAAGnRSTlMAQIDA0PdAMBDw6yDg3NDMpqCQkHBgYFAwEMgBv1gAAAD/SURBVEjH1c9pU4MwEIDhWAV6eN8mG6CiCUfvVv3//8y4TQeHkqx+6Ax9P2XIQ2aXmaIe0WOf7boDnfqDYWRtD3JOpMrAvh0sOJnS92hPQHG6jzOLuW2WVM7/kgYuAOBryk1xjB8Aa8UzvCrMabLZTAic4JU2p6WUyz18Eb78whVepZxn0pQ18asYPNRYaTDlnK9/8HofCxEixqZFmho7l9i8Bd8gpkN8etRYOuryzIdbMHPU5QXfHbXi2FGXF/zXzG+Ourzgn/AIxpyu/ETMrkpF2gpWWxwFejH2lhdQii1m/esh+NMrYfEu4auJL0l8W+OQsoMRq3s69w/xzL4BGGHGT7oqAiYAAAAASUVORK5CYII="
    }

    createElement(widget) {
        return template({
            type: this.config.type,
            widget: this.config.widget,
            icon: this.config.icon,
            id: widget.id
        });
    }

    createPaletteItem() {
        return {
            content: palette(this.config),
            numItems: 1
        }
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
            title: this.translate("widgets.ButtonTextContainer.label")
        }
    }

    hasChildren() { return true; }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.ButtonTextContainer.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.length == 0) errors.push("ButtonTextContainer.data.empty");
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(formData) {
        var keys = [];
        if (formData.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
