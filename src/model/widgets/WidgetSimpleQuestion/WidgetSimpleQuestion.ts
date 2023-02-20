import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetSimpleQuestion extends WidgetItemElement {

    static widget = "SimpleQuestion";
    static type = "specific-element";
    static category = "exerciseElement";
    static icon = icon;
    static cssClass = "widget-question";
    static paletteHidden = true;

    private static MAX_ANSWERS = 4;

    private static answersWithoutCorrect(answers: { text: string, correct: boolean }[]) {
        for (var i = 0; i < answers.length; i++) {
            var answer = answers[i];
            if (answer.correct)
                return false;
        }

        return true;
    }

    data: { question: string, answers: { text: string, correct: boolean }[], feedback: { positive: string, negative: string } }

    constructor(values: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", answers: [], feedback: { positive: "", negative: "" } };
    }

    clone(): WidgetSimpleQuestion {
        return new WidgetSimpleQuestion(this);
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data: {
            instanceId: string,
            answers: { text: string, correct: boolean }[],
            question: string,
            feedback: { positive: string, negative: string }
        } = {
            instanceId: this.id,
            answers: [],
            question: this.data.question,
            feedback: this.data.feedback
        };
        // Set the answer model
        for (var i = 0; i < WidgetSimpleQuestion.MAX_ANSWERS; i++) {
            const answer: { text: string, correct: boolean } = this.data.answers[i];
            if (answer)
                this.data.answers.push(answer);
            else
                this.data.answers.push({ text: "", correct: false });
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.SimpleQuestion.label")
        };
    }

    preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.SimpleQuestion.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.answers = [];
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;

        for (var i = 0; i < WidgetSimpleQuestion.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
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
        if (this.data.question.length == 0) errors.push("SimpleQuestion.question.empty");
        if (WidgetSimpleQuestion.answersWithoutCorrect(this.data.answers))
            errors.push("SimpleQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("SimpleQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form: any): string[] {
        var answers: { text: string, correct: boolean }[] = [];
        var errors: string[] = [];

        for (var i = 0; i < WidgetSimpleQuestion.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                });
            }
        }

        if (form.question.length == 0) errors.push("SimpleQuestion.question.empty");
        if (WidgetSimpleQuestion.answersWithoutCorrect(answers))
            errors.push("SimpleQuestion.answers.noCorrect");
        if (answers.length < 2) errors.push("SimpleQuestion.answers.notEnoughAnswers");
        return errors;
    }
}