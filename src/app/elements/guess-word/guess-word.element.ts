import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetGuessWordData, WidgetGuessWordData, WidgetGuessWordParams, WidgetInitOptions } from "../../../types";
import ItemElement from "../item/item.element";

export default class GuessWordElement extends ItemElement {

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

    constructor() { super(); }

    async init(values?: InputWidgetGuessWordData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Guess the word-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Guess the word-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : { question: "", answer: "", attempts: 1 };
    }

    get form(): Promise<string> {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help,
                question: this.data.question,
                answer: this.data.answer,
                attempts: this.data.attempts
            }));
    }

    get texts() {
        return { "help": this.params.help, "name": this.params.name, "question": this.data.question, "answer": this.data.answer }
    }

    get preview(): string {
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

    set texts(texts: any) {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.question = texts.question;
        this.data.answer = texts.answer;
    }

    validateModel(): string[] {
        let errors: string[] = [];
        if (!this.utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.question))
            errors.push("GuessWord.question.invalid")
        if (this.utils.isStringEmptyOrWhitespace(this.data.answer))
            errors.push("GuessWord.answer.invalid")
        if (!GuessWordElement.validateAttempts(this.data.attempts))
            errors.push("GuessWord.attempts.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        let errors: string[] = [];
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.question))
            errors.push("GuessWord.question.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.answer))
            errors.push("GuessWord.answer.invalid");
        if (!GuessWordElement.validateAttempts(form.attempts))
            errors.push("GuessWord.attempts.invalid");
        return errors;
    }

}