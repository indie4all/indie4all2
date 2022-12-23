import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class TabsContainer extends WidgetContainerElement{

    config = {
        widget: "TabsContainer",
        type: "specific-container",
        label: "Tabs menu",
        allow: ["TabContent"],
        category: "containers",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC5klEQVRoge2ZTWgTQRiG302qYpOmKaRKQadVEbVQEaWuiNr0oMQq2IqsQmzFCjnUS3rR5FR7MblVLxWCv6BFowcVC+bUVD0Yg0EoRMxB0pyVNrZGUdKViU2tOrv5abKbwj6wkDAzO8/+5N3sfBwWQXhhB4BOqEscwONEyD8tZbEgTXhhCIBzXUM96KYWryNRzIt3JUL+d5IahBcuEV4QA+NvRLVJzsyKtu4LIuGFKcILZjnpqRv3R1UXzkLF93aep+JOlq+O8IIVgPnEkTaVb+U/mIwGHGprpd+Psdp12Q+0YyVRK+OjqyjTPNGkS82qlSvMLo/P6vL4/kqRqlzzzOfmf5hqqtG8uQlp112IEwnJ8XqvHTMbLIjGJpntcs8Fs8lIH3ZjAKZdHl+/1+24nVOaCp/sG5Rs/9jTi/S9l9D32Zjt4sQkfnZcxs2Bgxi6/pDZZ8/OZjwYHpDTyPgDuOXy+OJetyOY80zLkkxBt70RencXW/rVe8w9e7ukKf7hDIDgcvshNkFLDwWRvae3hhMYWd/CbDPVGJAefg7d0V3SOyC/U6HnyQe0Su3nuwFi4hM4Ysn7qGWljU8j2D35GVwjI5JS38DZ90PvPi45nopUjThhuhYAn+KYfeYCEaDXBpRKmqKzH5BMh3ygV0LuavwwdRe+z6JtVESTVgpNWik0aaXQpJVCk1YKTVopcksnv5ZPJZkqapjsX1OuhSA9HMhsZaO2euFloSTSeu9p+TeTUkDqC3prySlN4fZtK690EWjpoRTLVpoWZSQXGtUi8CIMQ/VqtnQi5KfSwcErd/BltoyZXACPRscRjcWxkTQwB2XToz8ai48d7r5oPneqI7OEqwb0pAXGwxnpLZsI1ljqmBaL64h0OZXWEq3ZhT41WGupywhLrFkHvW5H+0JOz1dIz7J6ujw+Ua2DYJFvekhXTpUl45GvdH8FCNM74SrylaYlA1qrzsajCtD5271uh1rzLxEAvwBy0swa2Lf+uwAAAABJRU5ErkJggg==",
        cssClass: "widget-tabs-container"
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: ""
            },
            data: []
        }
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.TabsContainer.label")
        };
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = model.params.name ? model.params.name : this.translate("widgets.TabsContainer.label");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var keys = [];
        if (widget.data.length == 0) keys.push("TabsContainer.data.empty");
        if (!Utils.hasNameInParams(widget)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}