/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetTrueFalseItem, WidgetTrueFalseItemData } from "../../../types";

export default class WidgetTrueFalseItem extends WidgetSpecificItemElement {

    static widget = "TrueFalseItem";
    static icon = icon;

    data: WidgetTrueFalseItemData;

    static async create(values?: InputWidgetTrueFalseItem): Promise<WidgetTrueFalseItem> {
        return new WidgetTrueFalseItem(values);
    }

    constructor(values?: InputWidgetTrueFalseItem) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            question: "",
            answer: true,
            feedback: { positive: "", negative: "" }
        };
    }

    clone(): WidgetTrueFalseItem {
        const widget = new WidgetTrueFalseItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            question: this.data.question,
            feedback: this.data.feedback
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.TrueFalseItem.label")
        };
    }

    settingsOpened(): void {
        $("#modal-settings [name='correctAnswer']").val(this.data.answer.toString());
    }

    preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseItem.prev");
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
            errors.push("TrueFalseItem.question.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.question.length == 0)
            errors.push("TrueFalseItem.question.empty");
        return errors;
    }
}
