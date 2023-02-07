import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";

export default class WidgetMissingWords extends WidgetContainerElement {

    static widget = "MissingWords";
    static type = "specific-element-container";
    static allow = ["MissingWordsItem"];
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAe1BMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF4rQ2B4h5pEWXMeN1b///94h5oeN1ZWaID8hq1hc4n5DVz6SYT9wtbx8vSqtL+AjqBLYHiOm6r9pML7Z5n+4evj5urHzdW4wMqcp7X6KnDo+iaZAAAAE3RSTlMAQECA/jD34NBgELqmoJeIgHAwVfDHeQAAAOVJREFUSMfl1MkOgjAQgOFaAfe1m5RF3H3/JxTLICDI1ESN0f/Sy5ceOumQa7S9JSmaeQLJG+R27JxC1to+FqCpODK0xBsa3F0zvFDQDEtm0QuwyttZYB/sObDBcOo7vOrNn8CcT25YmuISjmTWDXO3hvMacAd/ut/AgYI2FljpzG61DVbMFLwTR7JaA/ahEv7fcdfTPqRQXHxC9VEsqkmmt8qkG7CsFrONgoIvHIrV5gdMxQHHicMNJiMnCpF7E7EGTKYCy0ktYDKkaYvV41IIGHI5lsFQH7M9UuT2EeuScp3WUnABOYiPkysTnZ0AAAAASUVORK5CYII=";
    static cssClass = "widget-missing-words";

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { 
            name: "Missing Words-" + Utils.generate_uuid(), 
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetMissingWords(this);
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
                title: this.translate("widgets.MissingWords.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.MissingWords.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Missing Words-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var errors = [];
        if (this.data.length == 0) errors.push("MissingWords.data.empty");
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        return errors;
    }

    validateForm(formData) {
        var keys = [];
        if (formData.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }


}