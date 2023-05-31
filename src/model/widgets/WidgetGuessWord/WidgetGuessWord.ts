import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetGuessWordData, WidgetGuessWordData, WidgetGuessWordParams } from "../../../types";

export default class WidgetGuessWord extends WidgetItemElement {

    static widget = "GuessWord";
    static category = "interactiveElements";
    static icon = icon;

    private static validateAttempts(attempts) {
        const MAX_ATTEMPTS = 9;
        const MIN_ATTEMPTS = 1;
        return attempts &&
            !isNaN(parseInt(attempts)) &&
            parseInt(attempts) <= MAX_ATTEMPTS &&
            parseInt(attempts) >= MIN_ATTEMPTS;
    }

    params: WidgetGuessWordParams;
    data: WidgetGuessWordData;

    static async create(values?: InputWidgetGuessWordData): Promise<WidgetGuessWord> {
        return new WidgetGuessWord(values);
    }

    constructor(values?: InputWidgetGuessWordData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Guess the word-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { question: "", answer: "", attempts: 1 };
    }

    clone(): WidgetGuessWord {
        const widget = new WidgetGuessWord();
        widget.params = structuredClone(this.params);
        widget.params.name = "Guess the word-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help,
            question: this.data.question,
            answer: this.data.answer,
            attempts: this.data.attempts
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.GuessWord.label")
        };
    }

    getTexts() {
        return { "help": this.params.help, "name": this.params.name, "question": this.data.question, "answer": this.data.answer }
    }

    preview(): string {
        return this.params?.name && this.data?.question ?
            this.params.name + " | " + this.data.question :
            this.translate("widgets.GuessWord.prev");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.help = form.help;
        this.params.name = form.instanceName;
        this.data.question = form.question;
        this.data.answer = form.answer.toUpperCase();
        this.data.attempts = form.attempts;
    }

    updateTexts(texts: any): void {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.question = texts.question;
        this.data.answer = texts.answer;
    }

    validateModel(): string[] {
        let errors: string[] = [];
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.question))
            errors.push("GuessWord.question.invalid")
        if (Utils.isStringEmptyOrWhitespace(this.data.answer))
            errors.push("GuessWord.answer.invalid")
        if (!WidgetGuessWord.validateAttempts(this.data.attempts))
            errors.push("GuessWord.attempts.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        let errors: string[] = [];
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.question))
            errors.push("GuessWord.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.answer))
            errors.push("GuessWord.answer.invalid");
        if (!WidgetGuessWord.validateAttempts(form.attempts))
            errors.push("GuessWord.attempts.invalid");
        return errors;
    }

}