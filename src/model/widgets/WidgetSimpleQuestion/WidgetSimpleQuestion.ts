import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { Feedback, FormEditData, InputWidgetSimpleQuestionData, WidgetSimpleQuestionData } from "../../../types";

export default class WidgetSimpleQuestion extends WidgetSpecificItemElement {

    static widget = "SimpleQuestion";
    static icon = icon;

    private static MAX_ANSWERS = 4;

    private static answersWithoutCorrect(answers: { text: string, correct: boolean }[]) {
        for (var i = 0; i < answers.length; i++) {
            var answer = answers[i];
            if (answer.correct)
                return false;
        }

        return true;
    }

    data: WidgetSimpleQuestionData;

    static async create(values?: InputWidgetSimpleQuestionData): Promise<WidgetSimpleQuestion> {
        return new WidgetSimpleQuestion(values);
    }

    constructor(values?: InputWidgetSimpleQuestionData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", answers: [], feedback: { positive: "", negative: "" } };
    }

    clone(): WidgetSimpleQuestion {
        const widget = new WidgetSimpleQuestion();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data: {
            instanceId: string,
            answers: { text: string, correct: boolean }[],
            question: string,
            feedback: Feedback
        } = {
            instanceId: this.id,
            // Initialize the possible answers
            answers: [...Array(WidgetSimpleQuestion.MAX_ANSWERS)].map((ans, idx) =>
                this.data.answers[idx] ?? { text: "", correct: false }),
            question: this.data.question,
            feedback: this.data.feedback
        };

        return {
            inputs: form(data),
            title: this.translate("widgets.SimpleQuestion.label")
        };
    }

    getTexts() {
        return {
            "answers": this.data.answers.map(ans => ({ "text": ans.text })),
            "question": this.data.question,
            "feedback": this.data.feedback
        }
    }

    preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.SimpleQuestion.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
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

    updateTexts(texts: any): void {
        this.data.question = texts.question;
        (texts.answers as any[]).forEach((ans, idx) => this.data.answers[idx].text = ans.text);
        this.data.feedback = texts.feedback;
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