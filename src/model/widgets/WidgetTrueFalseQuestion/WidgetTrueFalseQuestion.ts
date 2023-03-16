/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetTrueFalseQuestion extends WidgetSpecificItemElement {

    static widget = "TrueFalseQuestion";
    static category = "exerciseElement";
    static icon = icon;
    static cssClass = "widget-question";
    static paletteHidden = true;

    data: { question: string, answer: boolean, feedback: { positive: string, negative: string } }

    constructor(values?: any) {
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

    preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseQuestion.prev");
    }

    settingsOpened(): void {
        $("#modal-settings [name='correctAnswer']").val(this.data.answer.toString());
    }

    updateModelFromForm(form: any): void {
        this.data.answer = Utils.parseBoolean(form.correctAnswer);
        this.data.question = form.question;
        this.data.feedback.positive = form.feedbackPositive;
        this.data.feedback.negative = form.feedbackNegative;
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