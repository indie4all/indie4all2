indieauthor.widgets.ButtonTextItem = {
    widgetConfig: {
        widget: "ButtonTextItem",
        type: "specific-element",
        label: "Buttons with text Item",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) { },
    createElement: function (widgetInfo) {
        var element = indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
        return element;
    },
    template: function (options) {
        return '<div class="widget widget-question" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item" /></div><div class="b2" data-prev><span>{{translate "widgets.ButtonTextItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            image: modelValues.data.image,
            alt: modelValues.data.alt,
            
        }
        var template = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label for="image">{{translate "widgets.ButtonTextItem.form.image.label"}}</label>
            <input type="url" class="form-control" name="image" required placeholder="{{translate "widgets.ButtonTextItem.form.image.placeholder"}}" value="{{image}}" autocomplete="off" />
            <small class="form-text text-muted">{{translate "widgets.ButtonTextItem.form.image.help"}}</small>
          </div>
          <div class="form-group">
            <label for="alt">{{translate "common.alt.label"}}</label>
            <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
            <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
          </div>
          {{#if image}}
            <div class="form-group">
              <p>{{translate "widgets.ImageAndText.form.preview"}}</p>
              <img class="img-fluid" src="{{image}}"/>
            </div>
          {{/if}}
          <div class="form-group">
            <label for="text-{{instanceId}}">{{translate "widgets.ButtonTextItem.form.text.label"}}</label>
            <textarea rows="10" class="form-control texteditor" id="text-{{instanceId}}" name="text" required>
            </textarea>
            <small class="form-text text-muted">{{translate "widgets.ButtonTextItem.form.text.help"}}</small>
          </div>
        </form>`;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.ButtonTextItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        let $editor = $('#f-' + modelObject.id + ' .texteditor');
        indieauthor.widgetFunctions.initTextEditor(modelObject.data.text, $editor);
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.data.alt ? modelObject.data.alt : indieauthor.strings.widgets.ButtonTextItem.prev;
    },
    emptyData: function (options) {
        var object = {
            data: {
                text: "",
                image: "",
                alt: ""
            }
        };
        return object;
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.text = indieauthor.widgetFunctions.clearAndSanitizeHtml(formJson.text);
        modelObject.data.image = formJson.image;
        modelObject.data.alt = formJson.alt;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (widgetInstance.data.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (indieauthor.widgetFunctions.isEmptyText(widgetInstance.data.text)) errors.push("TextBlock.text.invalid");
        if (!indieauthor.utils.isIndieResource(widgetInstance.data.image)) errors.push("ButtonTextItem.image.invalid");
        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.alt))
            errors.push("common.alt.invalid")
        if (errors.length > 0) {
            return {
                element: widgetInstance.id,
                keys: errors
            }
        }

        return undefined;
    },
    validateForm: function (formData, instanceId) {
        var errors = [];

        if (formData.text.length == 0) errors.push("ButtonTextItem.text.invalid");
        if (indieauthor.widgetFunctions.isEmptyText(formData.text)) errors.push("TextBlock.text.invalid");
        if (!indieauthor.utils.isIndieResource(formData.image)) errors.push("ButtonTextItem.image.invalid");
        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            errors.push("common.alt.invalid")
        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAMAAABkkgs4AAAAqFBMVEUAAAAeN1YeN1Z4h5owR2MjPFp4h5oeN1YeN1Z4h5ooQF5OYXl4h5ozSmZ4h5orQ2AmPlx4h5p4h5oqQV8eN1Z4h5oeN1Z4h5p4h5p4h5r///94h5oeN1b5DVz8hq2Om6pWaIDHzdU9Um39wtbcZo3rOXTx8vQ4Tmq4wMpygpVHXHWqtL/+4evj5urV2d/9pMKcp7X7Z5lecIf6SYT5G2aAjqBGWnQqQl/wyqdVAAAAGnRSTlMAQIDA0PdAMBDw6yDg3NDMpqCQkHBgYFAwEMgBv1gAAAD/SURBVEjH1c9pU4MwEIDhWAV6eN8mG6CiCUfvVv3//8y4TQeHkqx+6Ax9P2XIQ2aXmaIe0WOf7boDnfqDYWRtD3JOpMrAvh0sOJnS92hPQHG6jzOLuW2WVM7/kgYuAOBryk1xjB8Aa8UzvCrMabLZTAic4JU2p6WUyz18Eb78whVepZxn0pQ18asYPNRYaTDlnK9/8HofCxEixqZFmho7l9i8Bd8gpkN8etRYOuryzIdbMHPU5QXfHbXi2FGXF/zXzG+Ourzgn/AIxpyu/ETMrkpF2gpWWxwFejH2lhdQii1m/esh+NMrYfEu4auJL0l8W+OQsoMRq3s69w/xzL4BGGHGT7oqAiYAAAAASUVORK5CYII="
}