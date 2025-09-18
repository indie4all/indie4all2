/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetTrueFalseQuestionData, WidgetInitOptions, WidgetTrueFalseQuestionData } from "../../../types";
import ItemElement from "../item/item.element";

export default class TrueFalseQuestionElement extends ItemElement {

    static widget = "TrueFalseQuestion";
    static category = "exerciseElement";
    static icon = icon;

    data: WidgetTrueFalseQuestionData;

    constructor() { super(); }

    async init(values?: InputWidgetTrueFalseQuestionData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : {
            question: "",
            answer: true,
            feedback: { positive: "", negative: "" }
        };
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            question: this.data.question,
            feedback: this.data.feedback
        }));
    }

    get texts() { return { "question": this.data.question, "feedback": this.data.feedback } }

    get preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseQuestion.prev");
    }

    settingsOpened(): void {
        $(".widget-editor [name='correctAnswer']").val(this.data.answer.toString());
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.answer = this.utils.parseBoolean(form.correctAnswer);
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;
    }

    set texts(texts: any) {
        this.data.question = texts.question;
        this.data.feedback = texts.feedback;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.question.length == 0)
            errors.push("TrueFalseQuestion.question.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.question.length == 0)
            errors.push("TrueFalseQuestion.question.empty");
        return errors;
    }
}