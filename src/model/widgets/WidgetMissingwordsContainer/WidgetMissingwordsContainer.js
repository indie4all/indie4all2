import form from "./form.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class WidgetMissingWords extends WidgetContainerElement {
    config = {
        widget: "MissingWords",
        type: "specific-element-container",
        label: "Missing Words",
        allow: ["MissingWordsItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAe1BMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF4rQ2B4h5pEWXMeN1b///94h5oeN1ZWaID8hq1hc4n5DVz6SYT9wtbx8vSqtL+AjqBLYHiOm6r9pML7Z5n+4evj5urHzdW4wMqcp7X6KnDo+iaZAAAAE3RSTlMAQECA/jD34NBgELqmoJeIgHAwVfDHeQAAAOVJREFUSMfl1MkOgjAQgOFaAfe1m5RF3H3/JxTLICDI1ESN0f/Sy5ceOumQa7S9JSmaeQLJG+R27JxC1to+FqCpODK0xBsa3F0zvFDQDEtm0QuwyttZYB/sObDBcOo7vOrNn8CcT25YmuISjmTWDXO3hvMacAd/ut/AgYI2FljpzG61DVbMFLwTR7JaA/ahEv7fcdfTPqRQXHxC9VEsqkmmt8qkG7CsFrONgoIvHIrV5gdMxQHHicMNJiMnCpF7E7EGTKYCy0ktYDKkaYvV41IIGHI5lsFQH7M9UuT2EeuScp3WUnABOYiPkysTnZ0AAAAASUVORK5CYII=",
        cssClass: "widget-missing-words"
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
            title: this.translate("widgets.MissingWords.label")
        };
    }

    preview(model) {
        return model.params?.name ?? this.translate("widgets.MissingWords.label");
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.length == 0) errors.push("MissingWords.data.empty");
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(formData) {
        var keys = [];
        if (formData.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }


}