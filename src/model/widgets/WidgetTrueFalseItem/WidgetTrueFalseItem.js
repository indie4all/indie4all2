/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetTrueFalseItem extends WidgetItemElement {

    static widget = "TrueFalseItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-true-false-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            question: "",
            answer: true,
            feedback: { positive: "", negative: "" }
        };
    }

    clone() {
        return new WidgetTrueFalseItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                question: this.data.question,
                feedback: this.data.feedback
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.TrueFalseItem.label")
            };
        });
    }

    settingsOpened() {
        $("#modal-settings [name='correctAnswer']").val(Utils.booleanToString(this.data.answer));
    }

    preview() {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseItem.prev");
    }

    updateModelFromForm(form) {
        this.data.answer = Utils.parseBoolean(form.correctAnswer);
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;
    }

    validateModel() {
        var errors = [];
        if (this.data.question.length == 0)
            errors.push("TrueFalseItem.question.empty");
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (form.question.length == 0)
            errors.push("TrueFalseItem.question.empty");
        return errors;
    }
}
