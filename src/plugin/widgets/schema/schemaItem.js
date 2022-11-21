indieauthor.widgets.SchemaItem = {
    widgetConfig: {
        widget: "SchemaItem",
        type: "specific-element",
        label: "Schema Item",
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
        return '<div class="widget widget-schema-item" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/></div><div class="b2" data-prev><span>{{translate "widgets.SchemaItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            alt: modelValues.data.alt
        }

        if (!indieauthor.utils.isEmpty(modelValues.data)) {
            templateValues.blob = modelValues.data.blob;
        }

        var inputTemplate = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label for="image">{{translate "widgets.SchemaItem.form.image.label"}}</label>
            <input type="file" class="form-control" name="image" accept="image/png, image/jpeg" />
            <small class="form-text text-muted">{{translate "widgets.SchemaItem.form.image.help"}}</small>
            <input type="hidden" name="blob" value="{{blob}}" />
          </div>
          <div class="form-group">
            <label for="alt">{{translate "common.alt.label"}}</label>
            <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
            <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
          </div>
          <div class="form-group d-none">
            <p>{{translate "widgets.SchemaItem.form.prev"}}</p>
            <img class="img-fluid img-preview" src="{{blob}}"/>
          </div>
        </form>`;
        var rendered = indieauthor.renderTemplate(inputTemplate, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.SchemaItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        const $form = $('#f-' + modelObject.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !modelObject.data.blob);
        $sectionPreview.toggleClass('d-none', !modelObject.data.blob);
        $iImg.on('change', function (e) {
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (this.files[0]) {
                indieauthor.utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                    $preview.attr('src', value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.data.alt ? modelObject.data.alt : indieauthor.strings.widgets.SchemaItem.prev;
    },
    emptyData: function (options) {
        var object = {
            data: {
                blob: "",
                alt: ""
            }
        };

        return object;
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.blob = formJson.blob;
        modelObject.data.alt = formJson.alt;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.blob))
            errors.push("common.imageblob.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.alt))
            errors.push("common.alt.invalid")

        if (errors.length > 0)
            return {
                element: widgetInstance.id,
                keys: errors
            }

        return undefined;
    },
    validateForm: function (formData) {
        var errors = [];

        if (!indieauthor.utils.isValidBase64DataUrl(formData.blob)) 
            errors.push("common.imageblob.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            errors.push("common.alt.invalid")

        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACZ0lEQVRoBWNkQAJy5mEGDAwMAQwDCx4wMDBseHRy1QdcroA7Ws48rJ+BgaFARlKUAYQHCpw4d40B6vDARydXXcDpDDnzsAY587D/Ow+e+j/Q4OPnL/89Ysv+y5mHvZczDxPA5+j3c1dsHXAHwwDI4VYB2SCHF2BzL5OceZgDAwODQIi3/QAnZQTg4+FmcLM3BfH9sckzwRgghYMJ8ONxD9OgcimRYNTR1AbsbKwCFe2zHCraZ6GUIoPa0QJ8PKDKbj8DA8P9ivZZCTDxoZI8QCE9HxTqDEMwTcczUNvRoCo4PKuRmkaiAwWG0dKDjmDU0fQCQ9LRLKQo/rf0MMO/ZYdxyqt+/spQ9fw1wx/vNtyG8HMxsExPA9PkApIc/SdzFl55XgYGBk2Q515ex6vur+5OBubKQLIdPZqm6QWGv6MZdeWpYimjrhxF+knKiKxHWxj+H8Gdya7eesiwZusBhvrCeNyGyIkyMMqJkORIdECSo0GA0UYTp9wXrv8M189w4lVDDTCaEekFRh1NL0BVR4MGLkO9HWjudKo7mh7Da6PJg15g1NH0AqOOphdggk7KwCZoBg3Yeeg0AzcXJ/aQfnRyFcjRBxonLGT49OXroHDzmq0HGa7desCgJCeJVR7WNC28duvBfs/YcoHkCC8GLVUFujoSBkCBtvPgabCj1ZXlGMREBLGqQ55HBA2nguYSHWADfQMBxEUEwQ7GMZd5oKMyzRHeCYDOkCZiU1nRPuv/QHkCGyC29MA9c0pfAHYHsY4uHAQOBqWEiQzEOrqjMu0AaK4aVjwOAADZ79hRmTZQ9lMIGBgYAGcFnkaUo+5mAAAAAElFTkSuQmCC"
}