indieauthor.widgets.AudioTermItem = {
    widgetConfig: {
        widget: "AudioTermItem",
        type: "specific-element",
        label: "Audio Term Item",
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
        return '<div class="widget widget-audio-term-item" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/></i></div><div class="b2" data-prev><span>{{translate "widgets.AudioTermItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            term: modelObject.data.term,
            definition: modelObject.data.definition,
            audioblob: modelObject.data.audioblob,
            captionsblob: modelObject.data.captionsblob
        }

        var template = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label>{{translate "widgets.AudioTermItem.form.term.label"}}</label>
            <input type="text" class="form-control" name="term" value="{{term}}" placeholder="{{translate "widgets.AudioTermItem.form.term.placeholder"}}" autocomplete="off" required/>
            <small class="form-text text-muted">{{translate "widgets.AudioTermItem.form.term.help"}}</small>
          </div>
          <div class="form-group">
            <label>{{translate "widgets.AudioTermItem.form.definition.label"}}</label>
            <textarea class="form-control" name="definition" placeholder="{{translate "widgets.AudioTermItem.form.definition.placeholder"}}" required>{{definition}}</textarea>
            <small class="form-text text-muted">{{translate "widgets.AudioTermItem.form.definition.help"}}</small>
          </div>
          <div class="form-group">
            <label>{{translate "widgets.AudioTermItem.form.audio.label"}}</label>
            <input type="file" class="form-control" name="audio" accept="audio/3gpp, audio/3gpp2, audio/aac, audio/ogg, audio/opus, audio/mp4, audio/mpeg, audio/vnd.wav, audio/vorbis, audio/wave, audio/x-aiff" />
            <small class="form-text text-muted">{{translate "widgets.AudioTermItem.form.audio.help"}}</small>
            <input type="hidden" name="audioblob" value="{{audioblob}}"/>
          </div>
          <div class="form-group">
            <label for="text">{{translate "common.captions.label"}}</label>
            <input type="file" class="form-control" name="captions" accept=".vtt" />
            <small class="form-text text-muted">{{translate "common.captions.help"}}</small>
            <input type="hidden" name="captionsblob" value="{{captionsblob}}" />
          </div>
        </form>`;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.AudioTermItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        let $form = $('#f-' + modelObject.id);
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        $iAudio.prop('required', !modelObject.data.audioblob);
        $iCaptions.prop('required', !modelObject.data.captionsblob);

        $iAudio.on('change', function(e) {
            $iAudioBlob.val('');
            $iAudio.prop('required', true);
            if (this.files[0]) {
                indieauthor.utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iAudio.prop('required', false);
                    $iAudioBlob.val(value);
                });
            }
        });

        $iCaptions.on('change', function(e) {
            $iCaptionsBlob.val('');
            $iCaptions.prop('required', true);
            if (this.files[0]) {
                indieauthor.utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iCaptions.prop('required', false);
                    $iCaptionsBlob.val(value);
                });
            }
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        if (modelObject.data.term && modelObject.data.definition)
            element.innerHTML = modelObject.data.term + " -> " + modelObject.data.definition;
        else
            element.innerHTML = indieauthor.strings.widgets.AudioTermItem.prev;
    },
    emptyData: function (options) {
        return {
            data: {
                term: "",
                definition: "",
                audioblob: "",
                captionsblob: ""
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.term = formJson.term;
        modelObject.data.definition = formJson.definition;
        modelObject.data.audioblob = formJson.audioblob;
        modelObject.data.captionsblob = formJson.captionsblob;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (widgetInstance.data.term.length == 0)
            errors.push("AudioTermItem.term.invalid");

        if (widgetInstance.data.definition.length == 0)
            errors.push("AudioTermItem.definition.invalid");

        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.captionsblob))
            errors.push("common.captionsblob.invalid");

        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.audioblob))
            errors.push("common.audioblob.invalid");

        if (errors.length > 0) {
            return {
                element: widgetInstance.id,
                keys: errors
            }
        }

        return undefined;
    },
    validateForm: function (formData) {
        var errors = [];

        if (formData.term.length == 0)
            errors.push("AudioTermItem.term.invalid");

        if (formData.definition.length == 0)
            errors.push("AudioTermItem.definition.invalid");

        if (!indieauthor.utils.isValidBase64DataUrl(formData.captionsblob))
            errors.push("common.captionsblob.invalid");

        if (!indieauthor.utils.isValidBase64DataUrl(formData.audioblob))
            errors.push("common.audioblob.invalid");

        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAACk0lEQVRoge2Zz2vTYBjHv83mxG1sGUxlIK9DEZ0w8CIBsay7+GsHJ0gQdKgIPWyX7aKpJ72Y3tSLh4KI+AMpol566Gmtu1gHIgwq7GLtPzA3p6e1kTcsXUqTNE2yvAnkA4U0ed++n/fJ07dv88SggwjiKQDTYEsFwKdqKfvbzKIhTQTxMYD5QyP7QV+s+PKtjG3xK9VS9rupBhHEB0QQlXzxq8Ka9T+byoWZuwoRxDUiiLyV9NrzdznmwhpU/Mz0HBWfN/LliCAmAPBXpyYYp/IOA/19ODdxmr6/bHSd0w5owyAxaOHDBcrUJpG01+zt2cNLciYhyZmmVSTQ0vxAP/2xWwTwU5Izt7TzYUkPGukXNOoIYU7fRAilR8FKuiZ/RP3NkuP+jKQ/oP42BNJuo6tnV6W3ph6hJr1Wj82i62QynkvrJepLP6CsVNu035mM3Ql0t5xZ/4fas7xlp67Z88Bgr6kEFx8Ddz3ednCnfVuklZVfamcruPgJxM6ONVpo0XEi6gRP0oPeXjerQae0pofJbbdqExsnvgnDSDo2fhg9G686+pCu9A0vndri+epBv0hOI2+3b2t6uKQ7d9+xqN2+nkvr0aeZWRQ7nSR2W7ppIAdyZjDZMLnJe/gZ6aZBXUY9+jfuF5G0X0TSfhFJ+0VopWlRRivQBIb852X09e4zlq6WslS68PDJS2xs/g2E8/tcEeXVCo6QEcPr2t5jobxaWbw4c4+/c+0STh4b9VVSgwYtX1xWpY8fJTgwPGTYTl9HpI9TaS0xoT3oY8HB4SFV2KSWWUinkpONXd52hfS2UUtJziisJmGE3dXDvHLqL6qHXemFAAjTTHgKu9LpVLJAa9Xa8sgAOv5kOpVkNb5LAPwHyz3KdqgqcKEAAAAASUVORK5CYII="
}