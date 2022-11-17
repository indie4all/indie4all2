indieauthor.widgets.MissingWords = {
    widgetConfig: {
        widget: "MissingWords",
        type: "specific-element-container",
        label: "Missing Words",
        allow: ["MissingWordsItem"],
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) {
        var item = {};
        item.content = indieauthor.renderTemplate('<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.MissingWords.label"}}</span></div>', this.widgetConfig);
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
        return '<div class="widget-missing-words" data-widget="{{widget}}" data-type="{{type}}" data-id="{{id}}"><div class="widget"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item" /> </div><div class="b2" data-prev><span>{{translate "widgets.MissingWords.label"}}</span></div><div class="b3" data-toolbar>  </div></div><div data-widget="{{widget}}" data-type="{{type}}" class="element-container dragula-container" data-content></div></div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            instanceName: modelObject.params.name,
            help: modelObject.params.help
        }

        var inputTemplate = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label for="instanceName">{{translate "common.name.label"}}</label>
            <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted">{{translate "common.name.help"}}</small>
          </div>
          <div class="form-group">
            <label for="help">{{translate "common.help.label"}}</label>
            <div class="input-group mb-3">
              <input name="help" type="text" class="form-control" placeholder="{{translate "common.help.placeholder"}}" value="{{help}}" />
              <div class="input-group-append">
                <button class="btn btn-indie" type="button" onclick="$(\'input[name=help]\').val(\'\')">{{translate "common.help.button"}}</button>
              </div>
            </div>
            <small class="form-text text-muted">{{translate "common.help.help"}}</small>
          </div>
        </form>`;

        var rendered = indieauthor.renderTemplate(inputTemplate, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.MissingWords.label
        };
    },
    settingsClosed: function (modelObject) {},
    settingsOpened: function (modelObject) {},
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = modelObject.params.name ? modelObject.params.name : indieauthor.strings.widgets.MissingWords.label;
    },
    emptyData: function (options) {
        var object = {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
                help: ""
            },
            data: []
        };

        return object;
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.params.name = formJson.instanceName;
        modelObject.params.help = formJson.help;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (widgetInstance.data.length == 0)
            errors.push("MissingWords.data.empty");


        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            errors.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            errors.push("common.name.notUniqueName");

        if (errors.length > 0)
            return {
                element: widgetInstance.id,
                keys: errors
            }

        return undefined;
    },
    validateForm: function (formData, instanceId) {
        var keys = [];

        if (formData.instanceName.length == 0)
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(formData.instanceName, instanceId))
            keys.push("common.name.notUniqueName");

        return keys;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAe1BMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF4rQ2B4h5pEWXMeN1b///94h5oeN1ZWaID8hq1hc4n5DVz6SYT9wtbx8vSqtL+AjqBLYHiOm6r9pML7Z5n+4evj5urHzdW4wMqcp7X6KnDo+iaZAAAAE3RSTlMAQECA/jD34NBgELqmoJeIgHAwVfDHeQAAAOVJREFUSMfl1MkOgjAQgOFaAfe1m5RF3H3/JxTLICDI1ESN0f/Sy5ceOumQa7S9JSmaeQLJG+R27JxC1to+FqCpODK0xBsa3F0zvFDQDEtm0QuwyttZYB/sObDBcOo7vOrNn8CcT25YmuISjmTWDXO3hvMacAd/ut/AgYI2FljpzG61DVbMFLwTR7JaA/ahEv7fcdfTPqRQXHxC9VEsqkmmt8qkG7CsFrONgoIvHIrV5gdMxQHHicMNJiMnCpF7E7EGTKYCy0ktYDKkaYvV41IIGHI5lsFQH7M9UuT2EeuScp3WUnABOYiPkysTnZ0AAAAASUVORK5CYII="
}