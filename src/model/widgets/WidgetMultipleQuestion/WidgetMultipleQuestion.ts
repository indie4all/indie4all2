import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { Feedback, FormEditData, InputWidgetMultipleQuestionData, WidgetMultipleQuestionData } from "../../../types";

export default class WidgetMultipleQuestion extends WidgetSpecificItemElement {

    static widget = "MultipleQuestion";
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

    data: WidgetMultipleQuestionData;

    static async create(values?: InputWidgetMultipleQuestionData): Promise<WidgetMultipleQuestion> {
        return new WidgetMultipleQuestion(values);
    }

    constructor(values?: InputWidgetMultipleQuestionData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { question: "", answers: [], feedback: { positive: "", negative: "" } };
    }

    clone(): WidgetMultipleQuestion {
        const widget = new WidgetMultipleQuestion();
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
            answers: [...Array(WidgetMultipleQuestion.MAX_ANSWERS)].map((ans, idx) =>
                this.data.answers[idx] ?? { text: "", correct: false }),
            question: this.data.question,
            feedback: this.data.feedback
        };
        console.log(data);
        return {
            inputs: form(data),
            title: this.translate("widgets.MultipleQuestion.label")
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
        return this.data?.question ? this.data.question : this.translate("widgets.MultipleQuestion.prev");
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

        for (var i = 0; i < WidgetMultipleQuestion.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                this.data.answers.push({
                    text: answer,
                    correct: form.correctAnswer[i]
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
        if (this.data.question.length == 0) errors.push("MultipleQuestion.question.empty");
        if (WidgetMultipleQuestion.answersWithoutCorrect(this.data.answers))
            errors.push("MultipleQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("MultipleQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form: any): string[] {
        var answers: { text: string, correct: boolean }[] = [];
        var errors: string[] = [];

        for (var i = 0; i < WidgetMultipleQuestion.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                answers.push({
                    text: answer,
                    correct: form.correctAnswer[i]
                });
            }
        }

        if (form.question.length == 0) errors.push("MultipleQuestion.question.empty");
        if (WidgetMultipleQuestion.answersWithoutCorrect(answers))
            errors.push("MultipleQuestion.answers.noCorrect");
        if (answers.length < 2) errors.push("MultipleQuestion.answers.notEnoughAnswers");
        return errors;
    }
}