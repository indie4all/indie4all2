/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetTrueFalseQuestion extends WidgetItemElement {

    static widget = "TrueFalseQuestion";
    static type = "specific-element";
    static category = "exerciseElement";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-question";
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
        return new WidgetTrueFalseQuestion(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var templateValues = {
                instanceId: this.id,
                question: this.data.question,
                feedback: this.data.feedback
            }

            return {
                inputs: form(templateValues),
                title: this.translate("widgets.TrueFalseQuestion.label")
            };
        });
    }

    preview() {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseQuestion.prev");
    }

    settingsOpened() {
        $("#modal-settings [name='correctAnswer']").val(Utils.booleanToString(this.data.answer));
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
            errors.push("TrueFalseQuestion.question.empty");
        return errors;
    }
    
    validateForm(form) {
        var errors = [];
        if (form.question.length == 0)
            errors.push("TrueFalseQuestion.question.empty");
        return errors;
    }
}