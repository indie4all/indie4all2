/* global $ */
import form from "./form.hbs";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import Utils from "../../../Utils";

export default class WidgetGapQuestion extends WidgetItemElement {

    config = {
        widget: "GapQuestion",
        type: "specific-element",
        label: "Gap Question",
        category: "exerciseElement",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACYUlEQVRoBe2ZT2gTQRSHfwmxYlqaLUSloGNRRBQEL7IgQtOL+OdgBVlEKCpCRLykl7rxpKfk1npRWBARFCV48JJDTk3sxVgQoRKhF+OehRqtPUjbkVkzaaKzZaXtzEbmg4XMy7DzzcvsbHZfBG0Q0zoGYBRqqQN45VYLX/0sWtLEtCYBZPYM7gQ7VPHmXQ1N8QtutfDeV4OY1l1iWrRUeUtV0/i+SE+PTVBiWgvEtIz1pBcevSgqF+Yw8ROjt5h4RuQbJaaVAmBcPDeseCmv0d/Xi1PDx1n7vOj7KP/AOoaJxDo+0VCZBkRLbzbbe7YZds5J2TmnYxcJtbTR38dudtMAPtk55yqPd8vyYJl+zLKOLlzTV9CF0kPQu4dEtLQs/jPpxhKWbzr4ufeGd6zYT71YGIj5OSxfnsLqzMdWe+VBCbSxhNjDtHJtoTR1v3QIc1afzQB/SLNfgM65Gxcp3gneVxht/Ah8AiYsmuBWIpSOHN2HCEl6Ge+Ik+Tfs/6HDG0Wvhdi7HkGSMTXAon471gI8L0QWbZ7PkyCzn1utTsmoRBfaZ7dyMnDoRBtR98RZaGlZaGlZaGlZaGlZaGlZRFtFmV4gSY0lF7Poje+Q5xpt1pg0uV7U0/wbTH4E8tW8rJYQW2+jv1kUDgK/2s6XpuvT58Zu21cv3QWRw4OKZFlSStVZj3pQwcIdiUHhP3a64jsdSqrJab4iz4V7E4OeMI+tcxyPpseaT0ENCuk10Q97ZxDVU1CRNDdw79yKhfPI6j0eAiE2Uq4j6DS+Wy6zGrVfHtUABt/JJ9Nqxp/gwD4BRpSrRtKNuT5AAAAAElFTkSuQmCC",
        cssClass: "widget-question"
    }

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
        maxAnswers: 4
    }

    MAX_ANSWERS = 4;

    emptyData(id) {
        return {
            id: id ?? Utils.generate_uuid(),
            type: this.config.type,
            widget: this.config.widget,
            data: {
                question: "",
                answers: [],
                feedback: { positive: "", negative: ""}
            }
        }
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            answers: [],
            question: model.data.question,
            preview: model.data.question.replace('[blank]', '____'),
            feedback: model.data.feedback
        }

        // Set the answer model
        for (var i = 0; i < this.MAX_ANSWERS; i++) {
            var answer = model.data.answers[i];
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
    }

    preview(model) {
        return model.data?.question ? model.data.question : this.translate("widgets.GapQuestion.prev");
    }

    settingsClosed(model) {
        $("#f-" + model.id + " [name=question]").off('keyup');
    }

    settingsOpened(model) {
        $("#f-" + model.id + " [name=question]").on('keyup', function () {
            const questionText = $("#f-" + model.id + " [name=question]").val();
            $("#f-" + model.id + " [name=questionPreview]").val(questionText.replace('[blank]', '____'));
        });
    }
    
    updateModelFromForm(model, form) {
        model.data.answers = [];
        model.data.question = form.question;
        model.data.feedback.positive = form.feedbackPositive;
        model.data.feedback.negative = form.feedbackNegative;
        for (var i = 0; i < this.extensions.maxAnswers; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                model.data.answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                })
            }
        }
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.question.length == 0) errors.push("GapQuestion.question.empty");
        if (!this.extensions.validateQuestionBlankSpots(widget.data.question))
            errors.push("GapQuestion.question.onlyOneBlank");
        if (this.extensions.answersWithoutCorrect(widget.data.answers))
            errors.push("GapQuestion.answers.noCorrect");
        if (widget.data.answers.length < 2)
            errors.push("GapQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form) {
        var answers = [];
        var errors = [];
        for (var i = 0; i < this.MAX_ANSWERS; i++) {
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