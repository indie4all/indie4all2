import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class WidgetTestContainer extends WidgetContainerElement {

    config = {
        widget: "Test",
        type: "specific-element-container",
        label: "Test",
        allow: ["GapQuestion", "SimpleQuestion", "TrueFalseQuestion"],
        category: "exerciseElement",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADpUlEQVRoge2ZX0hTURzHf5tZ5HRO0EKoqxQarIQoZJLknxdNDdKQGZVYmEbWgwPRLTLzxa1QZi8+TC0iAqcSPaRhL275kCZJUC7Qh+YIeigw/z7kn8XvbHep99y1cePeq/SFca9nh93P+fk9v9+55yhggxid/jgAFIO0cgPAC89Y708+igA0o9NbAaD2QGIC4EcqjU64wA9e4hnr/cCLwej09xid3jvkfOeVWnMLi94z5fVeRqefZXR6TTDo2e6eAcmBWSH4qeKbCF5L41UyOn0OAGhKi7IltvIfqaNVkJedjn+fo32vZG+wo5wUG4RHKSvSELUzob0fZwDmlsWh2aI9uyM1RrMtx2i2bcoivNAIu3LMACuZd+DXweuwerFddHiNOhqL3TAAfDGabVfYdjr03DKsFLaA1/Mj0LT+8j2smZ+LQ8sVRvoxRh2/2UXrwWeJtWcjEGG5vKlttahFMJEijeH8Lo8qAMBBhQ5H6yOfBUOHkQ2SgS/SirQkgNgoTrQjLp3m9N09/zR8SoGiDzI2CiIHb4OCiQ80Kc+ehAjTedEBaeK1B0Y78pOV+FvBJPgiLxP91dPEKjLTzqqIX799h6qGVkjKKIPMklvQ3tUvLlkQ8dqjrKaZgONbDF6tXX2kvfZaqTyh8ZUHQXFN23m/DlzTbigob4C+AQcHGgcnVNrUZGiqrRAGzepoCsnloE1JDkScNkCxRYVmX2y77YPkOjntDkR+q2ZG7aJDUyciQrc11sD8whLx8mvnOPkXtjXeEB2QJl574DtjxgltwBJ4LxcF9bTUeyB82pbFhTfS84tL8KjnFbydmAR1jAoqywplYxFe6Kr61k3pDCdj54M6yMviZhCxxVtc8IMZw95xl9zjIKxd/Rzof1Hecd6Es1kUdCLmZ6X7dnvwGqMC15Sb04ct70KEthMMrY7xrZ2xbGtTk8A1NUNyNq242DuaBEOzzwtVVGgs2zjy/gEnsYXvh1VgoCyWpJicvPbAipifnU6iDP5iI5ecHdTT6GU5ZIut+r8BKZa2LTRJvlIs5oNp6M04qKL2UnsoPWO9CO1obn9C1htyEKZaLGSHmEQqDZs9DK4p93BBeYOm8kIhydNSCIM25Bwn0EcOM7AvPo5KsfEcEbdT8Swxh93ok0L74+MIME9NcFhM1bmBPO0/Ib1K62k027yy8I1foWYP/pNTcUU4QoU2yAAYnfAQQoW2mKodeFbNpkcJhM/PtZiqpXq+QAHAb/c0MPPN6684AAAAAElFTkSuQmCC",
        cssClass: "widget-test"
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
            title: this.translate("widgets.Test.label")
        };
    }

    preview(model) {
        return model.params?.name ?? this.translate("widgets.Test");
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var keys = [];
        if (widget.data.length == 0) keys.push("Test.data.empty")
        if (!Utils.hasNameInParams(widget)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}