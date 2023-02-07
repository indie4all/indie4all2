/* global $ */
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetGapQuestion extends WidgetItemElement {

    static widget = "GapQuestion";
    static type = "specific-element";
    static category = "exerciseElement";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-question";
    static paletteHidden = true;

    static MAX_ANSWERS = 4;

    extensions = {
        validateQuestionBlankSpots: function (questionText) {
            if (!questionText || (questionText.length == 0))
                return false;

            var count = (questionText.match(/\[blank\]/g) || []).length;
            return (count == 1);
        },
        answersWithoutCorrect: function (answers) {
            for (var i = 0; i < answers.length; i++) {
                var answer = answers[i];
                if (answer.correct)
                    return false;
            }

            return true;
        },
        maxAnswers: WidgetGapQuestion.MAX_ANSWERS
    }

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            question: "",
            answers: [],
            feedback: { positive: "", negative: ""}
        };
    }

    clone() {
        return new WidgetGapQuestion(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                answers: [],
                question: this.data.question,
                preview: this.data.question.replace('[blank]', '____'),
                feedback: this.data.feedback
            }

            // Set the answer model
            for (var i = 0; i < WidgetGapQuestion.MAX_ANSWERS; i++) {
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
                title: this.translate("widgets.GapQuestion.label")
            };
        });
    }

    preview() {
        return this.data?.question ? this.data.question : this.translate("widgets.GapQuestion.prev");
    }

    settingsClosed() {
        $("#f-" + this.id + " [name=question]").off('keyup');
    }

    settingsOpened() {
        const id = this.id;
        $("#f-" + id + " [name=question]").on('keyup', function () {
            const questionText = $("#f-" + id + " [name=question]").val();
            $("#f-" + id + " [name=questionPreview]").val(questionText.replace('[blank]', '____'));
        });
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
        if (this.data.question.length == 0) errors.push("GapQuestion.question.empty");
        if (!this.extensions.validateQuestionBlankSpots(this.data.question))
            errors.push("GapQuestion.question.onlyOneBlank");
        if (this.extensions.answersWithoutCorrect(this.data.answers))
            errors.push("GapQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("GapQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form) {
        var answers = [];
        var errors = [];
        for (var i = 0; i < WidgetGapQuestion.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                })
            }
        }

        if (form.question.length == 0) errors.push("GapQuestion.question.empty");
        if (!this.extensions.validateQuestionBlankSpots(form.question))
            errors.push("GapQuestion.question.onlyOneBlank");
        if (this.extensions.answersWithoutCorrect(answers))
            errors.push("GapQuestion.answers.noCorrect");
        if (answers.length < 2)
            errors.push("GapQuestion.answers.notEnoughAnswers");
        return errors;
    }
    
}