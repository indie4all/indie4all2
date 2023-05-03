/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetTrueFalseQuestionData, WidgetTrueFalseQuestionData } from "../../../types";

export default class WidgetTrueFalseQuestion extends WidgetSpecificItemElement {

    static widget = "TrueFalseQuestion";
    static icon = icon;

    data: WidgetTrueFalseQuestionData;

    static async create(values?: InputWidgetTrueFalseQuestionData): Promise<WidgetTrueFalseQuestion> {
        return new WidgetTrueFalseQuestion(values);
    }

    constructor(values?: InputWidgetTrueFalseQuestionData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            question: "",
            answer: true,
            feedback: { positive: "", negative: "" }
        };
    }

    clone(): WidgetTrueFalseQuestion {
        const widget = new WidgetTrueFalseQuestion();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var templateValues = {
            instanceId: this.id,
            question: this.data.question,
            feedback: this.data.feedback
        };
        return {
            inputs: form(templateValues),
            title: this.translate("widgets.TrueFalseQuestion.label")
        };
    }

    getTexts() {
        return { "question": this.data.question, "feedback": this.data.feedback }
    }

    preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseQuestion.prev");
    }

    settingsOpened(): void {
        $("#modal-settings [name='correctAnswer']").val(this.data.answer.toString());
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.answer = Utils.parseBoolean(form.correctAnswer);
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;
    }

    updateTexts(texts: any): void {
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