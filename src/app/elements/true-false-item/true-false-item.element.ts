/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetTrueFalseItem, WidgetInitOptions, WidgetTrueFalseItemData } from "../../../types";
import SpecificItemElement from "../specific-item/specific-item.element";

export default class TrueFalseItemElement extends SpecificItemElement {

    static widget = "TrueFalseItem";
    static icon = icon;

    data: WidgetTrueFalseItemData;

    constructor() { super(); }

    async init(values?: InputWidgetTrueFalseItem, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
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

    get texts() {
        return {
            "question": this.data.question,
            "feedback": this.data.feedback
        }
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    set texts(texts: any) {
        this.data.question = texts.question;
        this.data.feedback = texts.feedback;
    }

    settingsOpened(): void {
        $(".widget-editor [name='correctAnswer']").val(this.data.answer.toString());
    }

    get preview(): string {
        return this.data?.question ? this.data.question : this.translate("widgets.TrueFalseItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.answer = this.utils.parseBoolean(form.correctAnswer);
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
