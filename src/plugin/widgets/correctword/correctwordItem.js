indieauthor.widgets.CorrectWordItem = {
    widgetConfig: {
        widget: "CorrectWordItem",
        type: "specific-element",
        label: "Correct Word Item",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) { },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function (options) {
        return '<div class="widget widget-correct-word-item" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/></div><div class="b2" data-prev><span>{{translate "widgets.CorrectWordItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            question: modelObject.data.question,
            word: modelObject.data.word,
            image: modelObject.data.image,
            blob: modelObject.data.blob,
            alt: modelObject.data.alt
        }

        var template = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label>{{translate "widgets.CorrectWordItem.form.question.label"}}</label>
            <input type="text" class="form-control" name="question" autocomplete="off" placeholder="{{translate "widgets.CorrectWordItem.form.question.placeholder"}}" value="{{question}}" required/>
            <small class="form-text text-muted">{{translate "widgets.CorrectWordItem.form.question.help"}}</small>
          </div>
          <div class="form-group">
            <label for="word">{{translate "widgets.CorrectWordItem.form.word.label"}}</label>
            <input type="text" class="form-control" name="word" required autocomplete="off" placeholder="{{translate "widgets.CorrectWordItem.form.word.help"}}" value="{{word}}"/>
            <small class="form-text text-muted">{{translate "widgets.CorrectWordItem.form.question.help"}}</small>
          </div>
          <div class="form-group">
            <label for="image">{{translate "widgets.CorrectWordItem.form.image.label"}}</label>
            <input type="url" class="form-control" name="image" required autocomplete="off" placeholder="{{translate "widgets.CorrectWord.form.image.placeholder"}}" value="{{image}}"/>
            <small class="form-text text-muted">{{translate "widgets.CorrectWordItem.form.image.help"}}</small>
            <input type="hidden" name="blob" value="{{blob}}" />
          </div>
          <div class="form-group">
            <label for="alt">{{translate "common.alt.label"}}</label>
            <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
            <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
          </div>
          {{#if image}}
          <p>{{translate "widgets.CorrectWordItem.form.preview"}}</p>
            <img class="img-fluid" src="{{image}}"/>
          {{/if}}
        </form>`;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.CorrectWordItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        const $form = $('#f-' + modelObject.id);
        $form.find('input[name="image"]').on('change', function (e) {
            $('input[name="blob"]').val('');
            indieauthor.utils.encodeAsBase64DataURL(e.target.value).then(value => 
                $('input[name="blob"]').val(value));
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = (modelObject.data.question && modelObject.data.word) ? (modelObject.data.question + " -> " + modelObject.data.word) : indieauthor.strings.widgets.CorrectWordItem.prev;
    },
    emptyData: function (options) {
        return {
            data: {
                question: "",
                word: "",
                image: "",
                blob: "",
                alt: ""
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.question = formJson.question;
        modelObject.data.image = formJson.image;
        modelObject.data.blob = formJson.blob;
        modelObject.data.word = formJson.word;
        modelObject.data.alt = formJson.alt;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (!indieauthor.utils.isIndieResource(widgetInstance.data.image)) errors.push("CorrectWordItem.image.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.question))
            errors.push("CorrectWordItem.question.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.word))
            errors.push("CorrectWordItem.word.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.alt))
            errors.push("common.alt.invalid");

        if (errors.length > 0)
            return {
                element: widgetInstance.id,
                keys: errors
            }

        return undefined;
    },
    validateForm: function (formData) {
        var errors = [];

        if (!indieauthor.utils.isIndieResource(formData.image))
            errors.push("CorrectWordItem.image.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.question))
            errors.push("formData.question.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.word))
            errors.push("formData.word.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            errors.push("common.alt.invalid");

        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAh1BMVEUAAAAeN1Z4h5oeN1Y4T2owR2MjPFp4h5oeN1YeN1Z4h5pOYXkpQV8oQF14h5ozSmZ4h5orQ2AmPlx4h5opQF54h5orQ2AeN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1aOm6rHzdVWaIA9Um35DVxHXHXx8vS4wMqcp7VecIeqtL+AjqBygpVTHpl4AAAAHXRSTlMAQMCA/tD3QDAQ8CDs6uDc0MymoJeQiHBgYFAwEEG2VFcAAACmSURBVEjH7c7LDoIwEIXhqhUKeL/f2hG1BdT3fz4VSkhM7LQxISz6b2bzZXLIOzZA2kekbgX0Yg7GTNsNZBxJyUD/DnKOpui2tD1QHO8x1JhbdO4InoYne3wV8c4BCxG64KUL7nvcKr59+nU7utljj//ECaQWWMoSk7lUqL1DUWEW0Dw1lj1BigqTaDECc7QQGtcJU994huJ1g0PMxglpOkzMI47kBYF000tT6KuDAAAAAElFTkSuQmCC"
}