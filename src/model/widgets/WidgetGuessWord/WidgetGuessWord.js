import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetGuessWord extends WidgetItemElement {
    
    static widget = "GuessWord";
    static type = "element";
    static label = "Guess the word";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1Z4h5oeN1YvRmI4T2ojPFp4h5oeN1YeN1Z4h5oeN1ZOYXkpQV8oQF14h5ozSmZ4h5omPlx4h5opQF54h5orQ2B4h5p4h5p4h5p4h5r///94h5oeN1aOm6rHzdVWaIA9Um35DVylr7vx8vQtRGHDytJpeo6WorA8Um2HlKVLX3jS191abIPh5Oi0vMdHXHW4wMqcp7WqtL+AjqBygpVhc4lGWnQBLUU7AAAAG3RSTlMAQMCA0P73QDAQ8Ggg7Org3NCmoJeQiGBQMBCao2KJAAABNklEQVRIx+3Q2VKDMBiGYVzo7r7757MqCUnYW7f7vzNJUqXUkZTxxBl9DwjMPPnJJKgb7XmajoOPzhHed4fD0cpeYkGeeDVYzR4syRsPp9bugJO/5/0Vpi26+yX4eHi7PX5gk6semLFhH3zWB+/2xRwlkU6JlNmXQkRtiHh9smbEUcNcElHME2zgaB2zlEqBmKDIFIkuHIESqVWGguoKkZgfIDd7Mo28jQvEqZJSuYl5asdDxvUiGFdtTEIhU1pKi1E6zM1889zAUgjKoN0tJIXD9A1WkEQAt1iWDeYi+XKMzHynmmwicTPJLhqyfc/efoAfTUTNW3vtNfkf/008w5z8VW8WB/sV99onvDo8GoTLeWeLF1TM4WB8eoDuwpw5/Bnz1MInXnzR4KHPTmZB0/VR9yFugnfrmMtHLpj99QAAAABJRU5ErkJggg==";
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
        this.params = values?.params ?? {
            name: WidgetGuessWord.label + "-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ?? { question: "", answer: "", attempts: 1 };
    }

    clone() {
        return new WidgetGuessWord(this);
    }

    getInputs() {
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

    preview() {
        return this.params?.name && this.data?.question ?
            this.params.name + " | " + this.data.question :
            this.translate("widgets.GuessWord.prev");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetGuessWord.label + "-" + Utils.generate_uuid();
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