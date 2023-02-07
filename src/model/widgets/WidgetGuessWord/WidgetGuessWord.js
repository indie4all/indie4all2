import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetGuessWord extends WidgetItemElement {
    
    static widget = "GuessWord";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-guess-word";

    extensions = {
        validateAttempts: function (attempts) {
            const MAX_ATTEMPTS = 9;
            const MIN_ATTEMPTS = 1;
            return attempts &&
                !isNaN(parseInt(attempts)) &&
                parseInt(attempts) <= MAX_ATTEMPTS &&
                parseInt(attempts) >= MIN_ATTEMPTS;
        },
    }

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Guess the word-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { question: "", answer: "", attempts: 1 };
    }

    clone() {
        return new WidgetGuessWord(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
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
        });
    }

    preview() {
        return this.params?.name && this.data?.question ?
            this.params.name + " | " + this.data.question :
            this.translate("widgets.GuessWord.prev");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Guess the word-" + this.id;
    }

    updateModelFromForm(form) {
        this.params.help = form.help;
        this.params.name = form.instanceName;
        this.data.question = form.question;
        this.data.answer = form.answer;
        this.data.attempts = form.attempts;
    }

    validateModel() {
        let errors = [];
        if (!Utils.hasNameInParams(this)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.question))
            errors.push("GuessWord.question.invalid")
        if (Utils.isStringEmptyOrWhitespace(this.data.answer))
            errors.push("GuessWord.answer.invalid")
        if (!this.extensions.validateAttempts(this.data.attempts))
            errors.push("GuessWord.attempts.invalid")
        return errors;
    }

    validateForm(form) {
        let errors = [];
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.question))
            errors.push("GuessWord.question.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.answer))
            errors.push("GuessWord.answer.invalid");
        if (!this.extensions.validateAttempts(form.attempts))
            errors.push("GuessWord.attempts.invalid");
        return errors;
    }

}