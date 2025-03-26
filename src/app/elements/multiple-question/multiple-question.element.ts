import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetMultipleQuestionData, WidgetInitOptions, WidgetMultipleQuestionData } from "../../../types";
import ItemElement from "../item/item.element";

export default class MultipleQuestionElement extends ItemElement {

    static widget = "MultipleQuestion";
    static category = "exerciseElement";
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

    constructor() { super(); }

    async init(values?: InputWidgetMultipleQuestionData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { question: "", answers: [], feedback: { positive: "", negative: "" } };
    }

    get form(): Promise<string> {
        const data = {
            instanceId: this.id,
            answers: [...Array(MultipleQuestionElement.MAX_ANSWERS)].map((ans, idx) =>
                this.data.answers[idx] ?? { text: "", correct: false }),
            question: this.data.question,
            feedback: this.data.feedback
        };
        return import('./form.hbs').then(({ default: form }) => form(data));
    }

    get texts() {
        return {
            "answers": this.data.answers.map(ans => ({ "text": ans.text })),
            "question": this.data.question,
            "feedback": this.data.feedback
        }
    }

    get preview(): string {
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

        for (var i = 0; i < MultipleQuestionElement.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                this.data.answers.push({
                    text: answer,
                    correct: form.correctAnswer[i]
                })
            }
        }

    }

    set texts(texts: any) {
        this.data.question = texts.question;
        (texts.answers as any[]).forEach((ans, idx) => this.data.answers[idx].text = ans.text);
        this.data.feedback = texts.feedback;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.question.length == 0) errors.push("MultipleQuestion.question.empty");
        if (MultipleQuestionElement.answersWithoutCorrect(this.data.answers))
            errors.push("MultipleQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("MultipleQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form: any): string[] {
        var answers: { text: string, correct: boolean }[] = [];
        var errors: string[] = [];

        for (var i = 0; i < MultipleQuestionElement.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                answers.push({
                    text: answer,
                    correct: form.correctAnswer[i]
                });
            }
        }

        if (form.question.length == 0) errors.push("MultipleQuestion.question.empty");
        if (MultipleQuestionElement.answersWithoutCorrect(answers))
            errors.push("MultipleQuestion.answers.noCorrect");
        if (answers.length < 2) errors.push("MultipleQuestion.answers.notEnoughAnswers");
        return errors;
    }
}