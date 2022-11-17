indieauthor.widgets.GuessWord = {
    widgetConfig: {
        widget: "GuessWord",
        type: "element",
        label: "Guess the word",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) {
        var item = {};
        item.content = indieauthor.renderTemplate('<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.GuessWord.label"}}</span></div>', this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        var element = indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
        return element;
    },
    template: function (options) {
        return '<div class="widget widget-guess-word" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"> <img src="' + this.icon + '" class="img-fluid drag-item" /> </div><div class="b2" data-prev><span>{{translate "widgets.GuessWord.prev"}} </span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            instanceName: modelValues.params.name,
            help: modelValues.params.help,
            question: modelValues.data.question,
            answer: modelValues.data.answer,
            attempts: modelValues.data.attempts
        };

        var template = `
            <form id="f-{{instanceId}}">
              <div class="form-group">
                <label for="instanceName">{{translate "common.name.label"}}</label>
                <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/>
                <small class="form-text text-muted">{{translate "common.name.help"}}</small>
              </div>
              <div class="form-group">
                <label for="help">{{translate "common.help.label"}}</label>
                <div class="input-group mb-3">
                  <input name="help" type="text" class="form-control" placeholder="{{translate "common.help.placeholder"}}" value="{{help}}">
                  <div class="input-group-append">
                    <button class="btn btn-indie" type="button" onclick="$(\'input[name=help]\').val(\'\')">{{translate "common.help.button"}}</button>
                  </div>
                </div>
                <small class="form-text text-muted">{{translate "common.help.help"}}</small>
              </div>
              <div class="form-row">
                <div class="form-group col-12">
                  <label for="question-{{instanceId}}">{{translate "widgets.GuessWord.form.question.label"}}</label>
                  <input type="text" id="question-{{instanceId}}" class="form-control" name="question" placeholder="{{translate "widgets.GuessWord.form.question.placeholder"}}" required value="{{question}}" />
                  <small class="form-text text-muted">{{translate "widgets.GuessWord.form.question.help"}}</small>
                </div>
                <div class="form-group col-12 col-lg-8">
                  <label for="answer-{{instanceId}}">{{translate "widgets.GuessWord.form.answer.label"}}</label>
                  <input type="text" id="answer-{{instanceId}}" class="form-control" name="answer" required placeholder="{{translate "widgets.GuessWord.form.answer.placeholder"}}" value="{{answer}}"/>
                  <small class="form-text text-muted">{{translate "widgets.GuessWord.form.answer.help"}}</small>
                </div>
                <div class="form-group col-12 col-lg-4">
                  <label for="attempts-{{instanceId}}">{{translate "widgets.GuessWord.form.attempts.label"}}</label>
                  <input type="number" min="1" max="9" step="1" class="form-control" id="attempts-{{instanceId}}" name="attempts" value="{{attempts}}" required />
                  <small class="form-text text-muted">{{translate "widgets.GuessWord.form.attempts.help"}}</small>
                </div>
              </div>
            </form>
            `;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.GuessWord.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) { },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        if (modelObject.params.name && modelObject.data.question)
            element.innerHTML = modelObject.params.name + " | " + modelObject.data.question;
        else
            element.innerHTML = indieauthor.strings.widgets.GuessWord.prev;
    },
    emptyData: function (options) {
        var object = {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
                help: "",
            },
            data: {
                question: "",
                answer: "",
                attempts: 1
            }
        };

        return object;
    },
    updateModelFromForm: function (modelObject, formData) {
        modelObject.params.help = formData.help;
        modelObject.params.name = formData.instanceName;
        modelObject.data.question = formData.question;
        modelObject.data.answer = formData.answer;
        modelObject.data.attempts = formData.attempts;
    },
    validateModel: function (widgetInstance) {
        let errors = [];

        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            errors.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            errors.push("common.name.notUniqueName");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.question))
            errors.push("GuessWord.question.invalid")

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.answer))
            errors.push("GuessWord.answer.invalid")

        if (!this.extensions.validateAttempts(widgetInstance.data.attempts))
            errors.push("GuessWord.attempts.invalid")

        return undefined;

    },
    validateForm: function (formData, instanceId) {
        let errors = [];

        if (formData.instanceName.length == 0)
            errors.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(formData.instanceName, instanceId))
            errors.push("common.name.notUniqueName");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.question))
            errors.push("GuessWord.question.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.answer))
            errors.push("GuessWord.answer.invalid");

        if (!this.extensions.validateAttempts(formData.attempts))
            errors.push("GuessWord.attempts.invalid");

        return errors;
    },
    extensions: {
        validateAttempts: function (attempts) {
            const MAX_ATTEMPTS = 9;
            const MIN_ATTEMPTS = 1;
            return attempts &&
                !isNaN(parseInt(attempts)) &&
                parseInt(attempts) <= MAX_ATTEMPTS &&
                parseInt(attempts) >= MIN_ATTEMPTS;
        },
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1Z4h5oeN1YvRmI4T2ojPFp4h5oeN1YeN1Z4h5oeN1ZOYXkpQV8oQF14h5ozSmZ4h5omPlx4h5opQF54h5orQ2B4h5p4h5p4h5p4h5r///94h5oeN1aOm6rHzdVWaIA9Um35DVylr7vx8vQtRGHDytJpeo6WorA8Um2HlKVLX3jS191abIPh5Oi0vMdHXHW4wMqcp7WqtL+AjqBygpVhc4lGWnQBLUU7AAAAG3RSTlMAQMCA0P73QDAQ8Ggg7Org3NCmoJeQiGBQMBCao2KJAAABNklEQVRIx+3Q2VKDMBiGYVzo7r7757MqCUnYW7f7vzNJUqXUkZTxxBl9DwjMPPnJJKgb7XmajoOPzhHed4fD0cpeYkGeeDVYzR4syRsPp9bugJO/5/0Vpi26+yX4eHi7PX5gk6semLFhH3zWB+/2xRwlkU6JlNmXQkRtiHh9smbEUcNcElHME2zgaB2zlEqBmKDIFIkuHIESqVWGguoKkZgfIDd7Mo28jQvEqZJSuYl5asdDxvUiGFdtTEIhU1pKi1E6zM1889zAUgjKoN0tJIXD9A1WkEQAt1iWDeYi+XKMzHynmmwicTPJLhqyfc/efoAfTUTNW3vtNfkf/008w5z8VW8WB/sV99onvDo8GoTLeWeLF1TM4WB8eoDuwpw5/Bnz1MInXnzR4KHPTmZB0/VR9yFugnfrmMtHLpj99QAAAABJRU5ErkJggg=="
}