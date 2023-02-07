import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetTabsContainer extends WidgetContainerElement{

    static widget = "TabsContainer";
    static type = "specific-container";
    static allow = ["TabContent"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC5klEQVRoge2ZTWgTQRiG302qYpOmKaRKQadVEbVQEaWuiNr0oMQq2IqsQmzFCjnUS3rR5FR7MblVLxWCv6BFowcVC+bUVD0Yg0EoRMxB0pyVNrZGUdKViU2tOrv5abKbwj6wkDAzO8/+5N3sfBwWQXhhB4BOqEscwONEyD8tZbEgTXhhCIBzXUM96KYWryNRzIt3JUL+d5IahBcuEV4QA+NvRLVJzsyKtu4LIuGFKcILZjnpqRv3R1UXzkLF93aep+JOlq+O8IIVgPnEkTaVb+U/mIwGHGprpd+Psdp12Q+0YyVRK+OjqyjTPNGkS82qlSvMLo/P6vL4/kqRqlzzzOfmf5hqqtG8uQlp112IEwnJ8XqvHTMbLIjGJpntcs8Fs8lIH3ZjAKZdHl+/1+24nVOaCp/sG5Rs/9jTi/S9l9D32Zjt4sQkfnZcxs2Bgxi6/pDZZ8/OZjwYHpDTyPgDuOXy+OJetyOY80zLkkxBt70RencXW/rVe8w9e7ukKf7hDIDgcvshNkFLDwWRvae3hhMYWd/CbDPVGJAefg7d0V3SOyC/U6HnyQe0Su3nuwFi4hM4Ysn7qGWljU8j2D35GVwjI5JS38DZ90PvPi45nopUjThhuhYAn+KYfeYCEaDXBpRKmqKzH5BMh3ygV0LuavwwdRe+z6JtVESTVgpNWik0aaXQpJVCk1YKTVopcksnv5ZPJZkqapjsX1OuhSA9HMhsZaO2euFloSTSeu9p+TeTUkDqC3prySlN4fZtK690EWjpoRTLVpoWZSQXGtUi8CIMQ/VqtnQi5KfSwcErd/BltoyZXACPRscRjcWxkTQwB2XToz8ai48d7r5oPneqI7OEqwb0pAXGwxnpLZsI1ljqmBaL64h0OZXWEq3ZhT41WGupywhLrFkHvW5H+0JOz1dIz7J6ujw+Ua2DYJFvekhXTpUl45GvdH8FCNM74SrylaYlA1qrzsajCtD5271uh1rzLxEAvwBy0swa2Lf+uwAAAABJRU5ErkJggg==";
    static cssClass = "widget-tabs-container";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Tabs menu-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetTabsContainer(this);
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
                title: this.translate("widgets.TabsContainer.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.TabsContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Tabs menu-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0) keys.push("TabsContainer.data.empty");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}