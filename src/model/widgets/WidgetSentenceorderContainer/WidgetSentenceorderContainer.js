import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";

export default class WidgetSentenceOrderContainer extends WidgetContainerElement {

    config = {
        widget: "SentenceOrderContainer",
        type: "specific-element-container",
        label: "Sentence Order",
        allow: ["SentenceOrderItem"],
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAllBMVEUAAAB4h5oeN1YeN1Z4h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1b8hq39wtb6SYRWaIBhc4nx8vQqQmD5DVxygpX+4ev6KnCOm6r+0eD6OnpHXHXHzdW4wMqcp7WAjqDV2d9kdYo5T2uwucP/8PX9pML7Z5lPY3v5G2YnP13j5uqOsgN3AAAAEXRSTlMAQECAMPfg0GAQuqagl4BwMDhYLxIAAAEwSURBVEjHzdPtboIwFIDhykDnvg+HVltRNlBU9uXu/+aGtOSIZBwdifH9RZqHppRW7PO6exHUTYBMwW1t781KQ2c/OTrt4RLYkmBsF5ECn0bP4gmc0EWwjFwfENXN59L12sSRsuBTwczZhYwWqupN7fF0+FTjCKpkicGmJA1WOAwfzsGhfw4eWEzLmynbN635CB98uKx7p8EGbrVqPrTxhF6KMYeqHGMWa2NP4hKNZjFkaNYAa4MZ8BgSTLVOMQEG2zYYx7iB07DeIm41i10FYgF9ZubX3H83+H3m/2Dfs9FM06lrzczfbsL87SbM38F/4mu+3ccRToFPO+xhxuNkF1dY3JlCM/Mm+BVaLB6Ra1dah8XYK3ue/l0JHXb5IRthMeLsUFD+iLG+OGzQWQl+AeD7iqUwHFqjAAAAAElFTkSuQmCC",
        cssClass: "widget-sentence-order"
    }

    emptyData(id) {
        return {
            id: id ?? Utils.generate_uuid(),
            type: this.config.type,
            widget: this.config.widget,
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
            title: this.translate("widgets.SentenceOrderContainer.label")
        };
    }

    preview(model) {
        return model.params?.name ?? this.translate("widgets.SentenceOrderContainer.label");
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.length == 0) errors.push("SentenceOrderContainer.data.empty");
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}