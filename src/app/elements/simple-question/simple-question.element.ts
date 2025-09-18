import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetSimpleQuestionData, WidgetInitOptions, WidgetSimpleQuestionData } from "../../../types";
import ItemElement from "../item/item.element";

export default class SimpleQuestionElement extends ItemElement {

    static widget = "SimpleQuestion";
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

    data: WidgetSimpleQuestionData;

    constructor() { super(); }

    async init(values?: InputWidgetSimpleQuestionData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : { question: "", answers: [], feedback: { positive: "", negative: "" } };
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            answers: [...Array(SimpleQuestionElement.MAX_ANSWERS)].map((ans, idx) =>
                this.data.answers[idx] ?? { text: "", correct: false }),
            question: this.data.question,
            feedback: this.data.feedback
        }));
    }

    get texts() {
        return {
            "answers": this.data.answers.map(ans => ({ "text": ans.text })),
            "question": this.data.question,
            "feedback": this.data.feedback
        }
    }

    get preview(): string {
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

        for (var i = 0; i < SimpleQuestionElement.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                this.data.answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
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
        if (this.data.question.length == 0) errors.push("SimpleQuestion.question.empty");
        if (SimpleQuestionElement.answersWithoutCorrect(this.data.answers))
            errors.push("SimpleQuestion.answers.noCorrect");
        if (this.data.answers.length < 2)
            errors.push("SimpleQuestion.answers.notEnoughAnswers");
        return errors;
    }

    validateForm(form: any): string[] {
        var answers: { text: string, correct: boolean }[] = [];
        var errors: string[] = [];

        for (var i = 0; i < SimpleQuestionElement.MAX_ANSWERS; i++) {
            var answer = form["answer" + i];
            if (answer && (answer.length > 0)) {
                answers.push({
                    text: answer,
                    correct: parseInt(form.correctAnswer) == i
                });
            }
        }

        if (form.question.length == 0) errors.push("SimpleQuestion.question.empty");
        if (SimpleQuestionElement.answersWithoutCorrect(answers))
            errors.push("SimpleQuestion.answers.noCorrect");
        if (answers.length < 2) errors.push("SimpleQuestion.answers.notEnoughAnswers");
        return errors;
    }
}