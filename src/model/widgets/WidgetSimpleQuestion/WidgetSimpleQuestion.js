import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetSimpleQuestion extends WidgetItemElement {

    static widget = "SimpleQuestion";
    static type = "specific-element";
    static category = "exerciseElement";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-question";
    static paletteHidden = true;

    extensions = {
        answersWithoutCorrect: function (answers) {
            for (var i = 0; i < answers.length; i++) {
                var answer = answers[i];
                if (answer.correct)
                    return false;
            }

            return true;
        },
        maxAnswers: 4
    }

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", answers: [], feedback: { positive: "", negative: "" } };
    }

    clone() {
        return new WidgetSimpleQuestion(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                answers: [],
                question: this.data.question,
                feedback: this.data.feedback
            }

            // Set the answer model
            for (var i = 0; i < this.extensions.maxAnswers; i++) {
                var answer = this.data.answers[i];
                if (answer)
                    data.answers.push(answer)
                else
                    data.answers.push({
                        text: "",
                        correct: false
                    })
            }
            return {
                inputs: form(data),
                title: this.translate("widgets.SimpleQuestion.label")
            };
        });
    }

    preview() {
        return this.data?.question ? this.data.question : this.translate("widgets.SimpleQuestion.prev");
    }

    updateModelFromForm(form) {
        this.data.answers = [];
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;

        for (var i = 0; i < this.extensions.maxAnswers; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                this.data.answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                })
            }
        }
    }

    validateModel() {
        var errors = [];
        if (this.data.question.length == 0) errors.push("SimpleQuestion.question.empty");
        if (this.extensions.answersWithoutCorrect(this.data.answers))
            errors.push("SimpleQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("SimpleQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form) {
        var answers = [];
        var errors = [];

        for (var i = 0; i < this.extensions.maxAnswers; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                });
            }
        }

        if (form.question.length == 0) errors.push("SimpleQuestion.question.empty");
        if (this.extensions.answersWithoutCorrect(answers))
            errors.push("SimpleQuestion.answers.noCorrect");
        if (answers.length < 2) errors.push("SimpleQuestion.answers.notEnoughAnswers");
        return errors;
    }
}