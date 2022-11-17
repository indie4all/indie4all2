indieauthor.widgets.ButtonTextContainer = {
    widgetConfig: {
        widget: "ButtonTextContainer",
        type: "specific-element-container",
        label: "Buttons with text",
        allow: ["ButtonTextItem"],
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) {
        var item = {};
        item.content = indieauthor.renderTemplate('<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.ButtonTextContainer.label"}}</span></div>', this.widgetConfig);
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
        return '<div class="widget-button-text" data-widget="{{widget}}" data-type="{{type}}" data-id="{{id}}"><div class="widget"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item" /> </div><div class="b2" data-prev><span>{{translate "widgets.ButtonTextContainer.label"}}</span></div><div class="b3" data-toolbar>  </div></div><div data-widget="{{widget}}" data-type="{{type}}" class="element-container dragula-container" data-content></div></div>';
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
            title: indieauthor.strings.widgets.ButtonTextContainer.label
        };
    },
    settingsClosed: function (modelObject) {},
    settingsOpened: function (modelObject) {},
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.querySelector("span").innerHTML = modelObject.params.name ? modelObject.params.name : indieauthor.strings.widgets.ButtonTextContainer.label;
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
            errors.push("ButtonTextContainer.data.empty");


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
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1YeN1Z4h5owR2MjPFp4h5oeN1YeN1Z4h5ooQF5OYXl4h5ozSmZ4h5orQ2AmPlx4h5p4h5oqQV8eN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1b5DVz8hq2Om6pWaIDHzdU9Um39wtbcZo3rOXTx8vQ4Tmq4wMpygpVHXHWqtL/+4evj5urV2d/9pMKcp7X7Z5lecIf6SYT5G2aAjqBGWnQqQl/wyqdVAAAAGnRSTlMAQIDA0PdAMBDw6yDg3NDMpqCQkHBgYFAwEMgBv1gAAAD/SURBVEjH1c9pU4MwEIDhWAV6eN8mG6CiCUfvVv3//8y4TQeHkqx+6Ax9P2XIQ2aXmaIe0WOf7boDnfqDYWRtD3JOpMrAvh0sOJnS92hPQHG6jzOLuW2WVM7/kgYuAOBryk1xjB8Aa8UzvCrMabLZTAic4JU2p6WUyz18Eb78whVepZxn0pQ18asYPNRYaTDlnK9/8HofCxEixqZFmho7l9i8Bd8gpkN8etRYOuryzIdbMHPU5QXfHbXi2FGXF/zXzG+Ourzgn/AIxpyu/ETMrkpF2gpWWxwFejH2lhdQii1m/esh+NMrYfEu4auJL0l8W+OQsoMRq3s69w/xzL4BGGHGT7oqAiYAAAAASUVORK5CYII="
}