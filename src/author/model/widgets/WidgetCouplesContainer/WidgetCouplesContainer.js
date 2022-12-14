import form from "./form.hbs";
import palette from "./palette.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";
import "./styles.scss";

export default class WidgetCouplesContainer extends WidgetElement {
    config = {
        widget: "CouplesContainer",
        type: "specific-element-container",
        label: "Couples",
        allow: ["CouplesItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAD80lEQVRoge2ZbUhTURjH/7tmkZYusCKIOymiNIooYhWZ9sVeFvSCzSgjwhKyL0pR24feX7bC0CAKlr1BQWlkHzKwPqSZlEkSSAvqyzaCPhTk+yf1xnPalsO7c8+dc9fCP4zdu3vuOb9z9pznec45JgyTbLUvA7ANxsoH4GmgtaYzGkUYWrbaKwGUzZ0zE/QxSu/avQiCbw+01nyMiiFb7adlq11paHqvGK2unl5l495jimy1/5KtdjMP+teth/WGA4dE4Gu2HSbwMjVeSbba8wCYC2y5BpvyX6VNS0V+7kq636r2XApdUMHxpHQOjzSuSAU1AR1vTZmcbHa4PHkOlyfCi0ziteP96sOth8/x7fsPLk7a9FTstOUif93KPz909WPQ9QRKR0CzGybbCiTtyQHSU0Y8M6dNo2D3CkCnw+UpdztL7mpCF5aeRXHhZuy05XEbpk4dPFaBlrprLDAR8OD1Bk1gpubP7CupdAOvFI30HYfL43M7Sxq50N09fSg7UCDUdm19I4MnaO4Ip6dAWmqB0tkPpcP/57eufqE2AOwDwIeOt0xyBpJbLoRNYWB3FYaefdDTSiYSPRGlLSsibFfDJKJKc6QtqwpHTxuUEvgZee//ySkdXZrQ/nePhCoqLD2jWYZMYdBVBylnEbPpAcf9sYGOt5hncY2u0n8yInJHmoJGVfVjrFqeza2EXB0l76HFg2mJHPa/QlIJLDFDP7p+kkXEt9WfuJVQ525ePhqGTnLuYN+6ImK8oLMXZOLKiVJdFTKlpyDJXaT/PUH9fzZNUt6I2aZpiSXCNinZ6u7RDs+xLKS50AO2ixgSnFAEndxynl2/eN2GI+duIHuBRfM971c/bl46qjnZh4sLLQoMNun87F8xrc1CbX0TTpXtg8i6k7wTeR490GNi05QdjuXeSUwRkbI1k2VmZHqZQOmGHpFeHvJg6EHziHKUXwd3i7h62/4Jq5cv1sWg2zxohCPSS52BIR7SPdJkEhH3UdJLWqIJTa5q/b3QD93hZyZBI0zAsaaXo1FME5FsWM2OQyLPIerGunr7uLtJauJC03JIdFUt5WQxH42gaRw8XoHK6lrN9yjZosQsftDuopgSHxrhjpe3db8nqoltsURpAjpRkoKHMkIhN5FqeN2G1JSpqi1KgdYagm48U3UP3b194wL4cX0TvF98mCfPUX0ecnnl3i++V5v2HjcX79rM1oZGiAatoamNQS+cL2NWxgxViuHniLSdSmeJeaGNPiM0O2MGA46Sjze6nSXrw8EleEK6X62kw+VRjOqEmkS9R/ST08SKcYhCl48DYLKEqxCFpiMDOqsOuUcDRO2vdztLjGp/lALwG87iVPccTNroAAAAAElFTkSuQmCC"
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
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help
        }
        
        return {
            inputs: form(data),
            title: this.translate("widgets.CouplesContainer.label")
        };
    }

    hasChildren() { return true; }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.CouplesContainer.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.length == 0) errors.push("CouplesContainer.data.empty");
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
