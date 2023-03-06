/* global $ */
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetGapQuestion extends WidgetSpecificItemElement {

    static widget = "GapQuestion";
    static type = "specific-element";
    static category = "exerciseElement";
    static icon = icon;
    static cssClass = "widget-question";
    static paletteHidden = true;

    static MAX_ANSWERS = 4;

    private static validateQuestionBlankSpots(questionText) {
        if (!questionText || (questionText.length == 0))
            return false;

        var count = (questionText.match(/\[blank\]/g) || []).length;
        return (count == 1);
    }

    private static answersWithoutCorrect(answers) {
        for (var i = 0; i < answers.length; i++) {
            var answer = answers[i];
            if (answer.correct)
                return false;
        }

        return true;
    }

    data: { question: string, answers: { text: string, correct: boolean }[], feedback: { positive: string, negative: string } }

    constructor(values?: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            question: "",
            answers: [],
            feedback: { positive: "", negative: "" }
        };
    }

    clone(): WidgetGapQuestion {
        const widget = new WidgetGapQuestion();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        let answers: { text: string, correct: boolean }[] = [];
        const data = {
            instanceId: this.id,
            answers,
            question: this.data.question,
            preview: this.data.question.replace('[blank]', '____'),
            feedback: this.data.feedback
        };
        // Set the answer model
        for (let i = 0; i < WidgetGapQuestion.MAX_ANSWERS; i++) {
            data.answers.push(this.data.answers[i] ?? {
                text: "",
                correct: false
            });
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.GapQuestion.label")
        };
    }

    preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.GapQuestion.prev");
    }

    settingsClosed(): void {
        $("#f-" + this.id + " [name=question]").off('keyup');
    }

    settingsOpened(): void {
        const id = this.id;
        $("#f-" + id + " [name=question]").on('keyup', function () {
            const questionText = <string>$("#f-" + id + " [name=question]").val();
            $("#f-" + id + " [name=questionPreview]").val(questionText.replace('[blank]', '____'));
        });
    }

    updateModelFromForm(form: any): void {
        this.data.answers = [];
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;
        for (var i = 0; i < WidgetGapQuestion.MAX_ANSWERS; i++) {
            const answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                this.data.answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                })
            }
        }
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.question.length == 0) errors.push("GapQuestion.question.empty");
        if (!WidgetGapQuestion.validateQuestionBlankSpots(this.data.question))
            errors.push("GapQuestion.question.onlyOneBlank");
        if (WidgetGapQuestion.answersWithoutCorrect(this.data.answers))
            errors.push("GapQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("GapQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form: any): string[] {
        var answers: { text: string, correct: boolean }[] = [];
        var errors: string[] = [];
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
        if (!WidgetGapQuestion.validateQuestionBlankSpots(form.question))
            errors.push("GapQuestion.question.onlyOneBlank");
        if (WidgetGapQuestion.answersWithoutCorrect(answers))
            errors.push("GapQuestion.answers.noCorrect");
        if (answers.length < 2)
            errors.push("GapQuestion.answers.notEnoughAnswers");
        return errors;
    }

}