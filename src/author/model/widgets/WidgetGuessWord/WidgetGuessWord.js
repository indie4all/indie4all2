import form from "./form.hbs";
import palette from "./palette.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";
import "./styles.scss";

export default class WidgetGuessWord extends WidgetElement {
    config = {
        widget: "GuessWord",
        type: "element",
        label: "Guess the word",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1Z4h5oeN1YvRmI4T2ojPFp4h5oeN1YeN1Z4h5oeN1ZOYXkpQV8oQF14h5ozSmZ4h5omPlx4h5opQF54h5orQ2B4h5p4h5p4h5p4h5r///94h5oeN1aOm6rHzdVWaIA9Um35DVylr7vx8vQtRGHDytJpeo6WorA8Um2HlKVLX3jS191abIPh5Oi0vMdHXHW4wMqcp7WqtL+AjqBygpVhc4lGWnQBLUU7AAAAG3RSTlMAQMCA0P73QDAQ8Ggg7Org3NCmoJeQiGBQMBCao2KJAAABNklEQVRIx+3Q2VKDMBiGYVzo7r7757MqCUnYW7f7vzNJUqXUkZTxxBl9DwjMPPnJJKgb7XmajoOPzhHed4fD0cpeYkGeeDVYzR4syRsPp9bugJO/5/0Vpi26+yX4eHi7PX5gk6semLFhH3zWB+/2xRwlkU6JlNmXQkRtiHh9smbEUcNcElHME2zgaB2zlEqBmKDIFIkuHIESqVWGguoKkZgfIDd7Mo28jQvEqZJSuYl5asdDxvUiGFdtTEIhU1pKi1E6zM1889zAUgjKoN0tJIXD9A1WkEQAt1iWDeYi+XKMzHynmmwicTPJLhqyfc/efoAfTUTNW3vtNfkf/008w5z8VW8WB/sV99onvDo8GoTLeWeLF1TM4WB8eoDuwpw5/Bnz1MInXnzR4KHPTmZB0/VR9yFugnfrmMtHLpj99QAAAABJRU5ErkJggg=="
    }

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

    createElement(widget) {
        return template({
            type: this.config.type,
            widget: this.config.widget,
            icon: this.config.icon,
            id: widget.id
        });
    }

    createPaletteItem() {
        return palette(this.config); 
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: "",
            },
            data: { question: "", answer: "", attempts: 1 }
        };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help,
            question: model.data.question,
            answer: model.data.answer,
            attempts: model.data.attempts
        };

        return {
            inputs: form(data),
            title: this.translate("widgets.GuessWord.label")
        };
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        if (model.params.name && model.data.question)
            element.innerHTML = model.params.name + " | " + model.data.question;
        else
            element.innerHTML = this.translate("widgets.GuessWord.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        model.params.help = form.help;
        model.params.name = form.instanceName;
        model.data.question = form.question;
        model.data.answer = form.answer;
        model.data.attempts = form.attempts;
    }

    validateModel(widget) {
        let errors = [];
        if (!Utils.hasNameInParams(widget)) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.question))
            errors.push("GuessWord.question.invalid")
        if (Utils.isStringEmptyOrWhitespace(widget.data.answer))
            errors.push("GuessWord.answer.invalid")
        if (!this.extensions.validateAttempts(widget.data.attempts))
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