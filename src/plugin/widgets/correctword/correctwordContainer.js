indieauthor.widgets.CorrectWord = {
    widgetConfig: {
        widget: "CorrectWord",
        type: "specific-element-container",
        label: "Correct word",
        allow: ["CorrectWordItem"],
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) {
        var item = {};
        item.content = indieauthor.renderTemplate('<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.CorrectWord.label"}}</span></div>', this.widgetConfig);
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
        return '<div class="widget-correct-word" data-widget="{{widget}}" data-type="{{type}}" data-id="{{id}}"><div class="widget"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item" /> </div><div class="b2" data-prev><span>{{translate "widgets.CorrectWord.label"}}</span></div><div class="b3" data-toolbar>  </div></div><div data-widget="{{widget}}" data-type="{{type}}" class="element-container dragula-container" data-content></div></div>';
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
            title: indieauthor.strings.widgets.CorrectWord.label
        };
    },
    settingsClosed: function (modelObject) {},
    settingsOpened: function (modelObject) {},
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = modelObject.params.name ? modelObject.params.name : indieauthor.strings.widgets.CorrectWord.label;
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
            errors.push("CorrectWord.data.empty");


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
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAvVBMVEUAAAAeN1YeN1Z4h5ovRmI3TGgjPFp4h5oeN1Z4h5ooQF54h5p4h5p4h5ozSmZ4h5omPlwqQV8eN1Z4h5oeN1Z4h5oeN1b///8eN1Z4h5qOm6rHzdVWaIA9Um3+4Or5DVz9wtbx8vQrQ2BygpX5HWf8jrP7XpJHXHX7Tof6LXLj5ur+0eDV2d+4wMqAjqDsdp3vPXg5T2r9vtSqtL+cp7X9rsn7bp1jdIr/7/T+z979nr78fqhcboX6PX1GWnQ8cNfCAAAAF3RSTlMAQIDA0BD3QDDw65go4NzQppBwYGBQIGoLbbUAAAF/SURBVEjH1dT7V4IwFAdwKt/a+7GLGLiBA0woFB9p9f//WW1AYx3H1m/V13N2ED5e7+XALJbeqSF3besr15BN9IFBr7KnkCBDcNipandyZAzObgp7Arg+lyRYrdNWhcWZOQEgaj0+wg6wOAYskhKS1v+jx3KwDysZX3TbjRiHADCW8KPdv23ACwI8PpawbXcLLEw1XUKgTIhlPJTxipR95iCSyfhMwmNgSRHyQYoSC7OdwA+wuP6PMFFZ0oAXRGEXR1iXP42fptOpq1pU+MXzvGfV8osD+uLVXuqwu2ET5SFChxn/RiO3GbsxM5g4rGSwRq/xQdfG+4ZfmfDDWcA+up4pZQuuHp/I2zcNyHvbx3z1fVRWjmJXiVl7FLnBmu9xMC/tElGm1ZUp3UT8YJsWt6z4IY2aeo6Cok6xZ7n1bDJ+EDvybiffQ/Qt4UeBrVaIkSkr2Ja418lyR5vEh9AusdW+GoA+2ZtdYhHbFBlfGvGwxl2T7Y+sOvfn+iZG1idv5LZVG7+gBgAAAABJRU5ErkJggg=="
}