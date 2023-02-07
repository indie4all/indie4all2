/* global $ */
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetGapQuestion extends WidgetItemElement {

    static widget = "GapQuestion";
    static type = "specific-element";
    static category = "exerciseElement";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACYUlEQVRoBe2ZT2gTQRSHfwmxYlqaLUSloGNRRBQEL7IgQtOL+OdgBVlEKCpCRLykl7rxpKfk1npRWBARFCV48JJDTk3sxVgQoRKhF+OehRqtPUjbkVkzaaKzZaXtzEbmg4XMy7DzzcvsbHZfBG0Q0zoGYBRqqQN45VYLX/0sWtLEtCYBZPYM7gQ7VPHmXQ1N8QtutfDeV4OY1l1iWrRUeUtV0/i+SE+PTVBiWgvEtIz1pBcevSgqF+Yw8ROjt5h4RuQbJaaVAmBcPDeseCmv0d/Xi1PDx1n7vOj7KP/AOoaJxDo+0VCZBkRLbzbbe7YZds5J2TmnYxcJtbTR38dudtMAPtk55yqPd8vyYJl+zLKOLlzTV9CF0kPQu4dEtLQs/jPpxhKWbzr4ufeGd6zYT71YGIj5OSxfnsLqzMdWe+VBCbSxhNjDtHJtoTR1v3QIc1afzQB/SLNfgM65Gxcp3gneVxht/Ah8AiYsmuBWIpSOHN2HCEl6Ge+Ik+Tfs/6HDG0Wvhdi7HkGSMTXAon471gI8L0QWbZ7PkyCzn1utTsmoRBfaZ7dyMnDoRBtR98RZaGlZaGlZaGlZaGlZaGlZRFtFmV4gSY0lF7Poje+Q5xpt1pg0uV7U0/wbTH4E8tW8rJYQW2+jv1kUDgK/2s6XpuvT58Zu21cv3QWRw4OKZFlSStVZj3pQwcIdiUHhP3a64jsdSqrJab4iz4V7E4OeMI+tcxyPpseaT0ENCuk10Q97ZxDVU1CRNDdw79yKhfPI6j0eAiE2Uq4j6DS+Wy6zGrVfHtUABt/JJ9Nqxp/gwD4BRpSrRtKNuT5AAAAAElFTkSuQmCC";
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