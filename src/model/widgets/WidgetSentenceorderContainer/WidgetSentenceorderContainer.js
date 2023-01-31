import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetSentenceOrderContainer extends WidgetContainerElement {

    static widget = "SentenceOrderContainer";
    static type = "specific-element-container";
    static label = "Sentence Order";
    static allow = ["SentenceOrderItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAllBMVEUAAAB4h5oeN1YeN1Z4h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1b8hq39wtb6SYRWaIBhc4nx8vQqQmD5DVxygpX+4ev6KnCOm6r+0eD6OnpHXHXHzdW4wMqcp7WAjqDV2d9kdYo5T2uwucP/8PX9pML7Z5lPY3v5G2YnP13j5uqOsgN3AAAAEXRSTlMAQECAMPfg0GAQuqagl4BwMDhYLxIAAAEwSURBVEjHzdPtboIwFIDhykDnvg+HVltRNlBU9uXu/+aGtOSIZBwdifH9RZqHppRW7PO6exHUTYBMwW1t781KQ2c/OTrt4RLYkmBsF5ECn0bP4gmc0EWwjFwfENXN59L12sSRsuBTwczZhYwWqupN7fF0+FTjCKpkicGmJA1WOAwfzsGhfw4eWEzLmynbN635CB98uKx7p8EGbrVqPrTxhF6KMYeqHGMWa2NP4hKNZjFkaNYAa4MZ8BgSTLVOMQEG2zYYx7iB07DeIm41i10FYgF9ZubX3H83+H3m/2Dfs9FM06lrzczfbsL87SbM38F/4mu+3ccRToFPO+xhxuNkF1dY3JlCM/Mm+BVaLB6Ra1dah8XYK3ue/l0JHXb5IRthMeLsUFD+iLG+OGzQWQl+AeD7iqUwHFqjAAAAAElFTkSuQmCC";
    static cssClass = "widget-sentence-order";

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: WidgetSentenceOrderContainer.label + "-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetSentenceOrderContainer(this);
    }

    getInputs() {
        const data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.SentenceOrderContainer.label")
        };
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.SentenceOrderContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetSentenceOrderContainer.label + "-" + Utils.generate_uuid();
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var errors = [];
        if (this.data.length == 0) errors.push("SentenceOrderContainer.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}