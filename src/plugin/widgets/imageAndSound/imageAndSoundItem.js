indieauthor.widgets.ImageAndSoundItem = {
    widgetConfig: {
        widget: "ImageAndSoundItem",
        type: "specific-element",
        label: "Image and Sound Item",
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
        return '<div class="widget widget-image-and-sound-item" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/></div><div class="b2" data-prev><span>{{translate "widgets.ImageAndSoundItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            audio: modelObject.data.audio,
            text: modelObject.data.text,
            image: modelObject.data.image,
            alt: modelObject.data.alt,
            captions: modelObject.data.captions,
            blob: modelObject.data.blob,
            audioblob: modelObject.data.audioblob,
            captionsblob: modelObject.data.captionsblob
        }

        var template = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label>{{translate "widgets.ImageAndSoundItem.form.audio.label"}}</label>
            <input type="url" class="form-control" name="audio" placeholder="{{translate "widgets.ImageAndSoundItem.form.audio.placeholder"}}" value="{{audio}}" autocomplete="off" required/> 
            <small class="form-text text-muted">{{translate "widgets.ImageAndSoundItem.form.audio.help"}}</small> 
            <input type="hidden" name="audioblob" value="{{audioblob}}" />
          </div>
          <div class="form-group">
            <label>{{translate "widgets.ImageAndSoundItem.form.text.label"}}</label>
            <textarea class="form-control" name="text" placeholder="{{translate "widgets.ImageAndSoundItem.form.text.placeholder"}}">{{text}}</textarea>
            <small class="form-text text-muted">{{translate "widgets.ImageAndSoundItem.form.text.help"}}</small>
          </div>
          <div class="form-group">
            <label for="image">{{translate "widgets.ImageAndSoundItem.form.image.label"}}</label>
            <input type="url" class="form-control" name="image" required autocomplete="off" placeholder="{{translate "widgets.ImageAndText.form.image.placeholder"}}" value="{{image}}"/>
            <small class="form-text text-muted">{{translate "widgets.ImageAndSoundItem.form.image.help"}}</small>
            <input type="hidden" name="blob" value="{{blob}}" />
          </div>
          <div class="form-group">
            <label for="alt">{{translate "common.alt.label"}}</label>
            <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
            <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
          </div>
          {{#if image}}
          <p>{{translate "widgets.ImageAndSoundItem.form.preview"}}</p>
          <img class="img-fluid" src="{{image}}"/>
          {{/if}}
          <div class="form-group">
            <label for="text">{{translate "common.captions.label"}}</label>
            <input type="url" class="form-control" name="captions" placeholder="{{translate "common.captions.placeholder"}}" value="{{{captions}}}" autocomplete="off"></input>
            <small class="form-text text-muted">{{translate "common.captions.help"}}</small>
            <input type="hidden" name="captionsblob" value="{{captionsblob}}" />
           </div>
        </form>`;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.ImageAndSoundItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        let $form = $('#f-' + modelObject.id);
        $form.find('input[name="image"]').on('change', function (e) {
            $('input[name="blob"]').val('');
            indieauthor.utils.encodeAsBase64DataURL(e.target.value).then(value => 
                $('input[name="blob"]').val(value));
        });

        $form.find('input[name="audio"]').on('change', function (e) {
            $('input[name="audioblob"]').val('');
            indieauthor.utils.encodeAsBase64DataURL(e.target.value).then(value => 
                $('input[name="audioblob"]').val(value));
        });

        $form.find('input[name="captions"]').on('change', function (e) {
            $('input[name="captionsblob"]').val('');
            indieauthor.utils.encodeAsBase64DataURL(e.target.value).then(value => 
                $('input[name="captionsblob"]').val(value));
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.data.text ? modelObject.data.text : indieauthor.strings.widgets.ImageAndSoundItem.prev;
    },
    emptyData: function (options) {
        return {
            data: {
                audio: "",
                image: "",
                text: "",
                alt: "",
                captions: "",
                blob: "",
                audioblob: "",
                captionsblob: ""
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.audio = formJson.audio;
        modelObject.data.audioblob = formJson.audioblob;
        modelObject.data.captionsblob = formJson.captionsblob;
        modelObject.data.image = formJson.image;
        modelObject.data.blob = formJson.blob;
        modelObject.data.text = formJson.text;
        modelObject.data.alt = formJson.alt;
        modelObject.data.captions = formJson.captions;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (!indieauthor.utils.isIndieResource(widgetInstance.data.audio)) errors.push("ImageAndSoundItem.audio.invalid");
        if (!indieauthor.utils.isIndieResource(widgetInstance.data.image)) errors.push("ImageAndSoundItem.image.invalid");

        if (!indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.captions) && !indieauthor.utils.isIndieResource(widgetInstance.data.captions))
            errors.push("common.captions.invalid");

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

        if (!indieauthor.utils.isIndieResource(formData.audio)) errors.push("ImageAndSoundItem.audio.invalid");

        if (!indieauthor.utils.isIndieResource(formData.image)) errors.push("ImageAndSoundItem.image.invalid");

        if (!indieauthor.utils.isStringEmptyOrWhitespace(formData.captions) && !indieauthor.utils.isIndieResource(formData.captions))
            errors.push("common.captions.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            errors.push("common.alt.invalid")

        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADlUlEQVRoge2Zb0gTYRjAnztn4TQ3wwohLikkJxWRxCIc6pfKDLKQFZRJfxhkXzaC3IqwPx/cl7AIDAZRfShSgvqQwvrinxloUkjGFvbFjaAPBjr/fSl38bzbXZu7neftdrfCHxzvu+3u3t/ePc9zt3spiIMxW/cCQANoyyQAvAmNdM+ksuClGbO1AwDsW0s2AW5aMfzJDzHxE6GR7rGUGozZeosxW1nvwAdWa8Jz8+yRpmssY7ZOM2arUUx6+vHLHs2FOVD8YMMVFLcL+dKM2VoDAMbG+mqNQ/kvhQX5cKh6P74+LvQ5zXVwx2zCIOJDZ5WpRP5JaV3aZwgvwu/LHtKuFqq+EnJaDqc8av26XKOz3YM5N+Z22fi6nbb0UqcXIm8/yjvYFxCVNhYW4MWuDwBmnO0eh9tlewpqhgfFFENu73XQvRCsYiuB9fpJbNYzI617ZEuQy3GfhdwvHRDxfY2GknyaQZGYFhCmz1gSYzw0Bb92OUiXPlYJdJWJhBU7Hlzt6UtBSWmUpSwmEgYEgx6o3duIGBteBF3vDaAMeoj4AsAOBYANTckfSynpBOEYtKUclsaDJFHZzyE5MyuIYjHN+gJJ71FVpmgnFiq0xUTCI8d1kvQ1l44MJUvHi1F7GPIlSMhgeASzIDz4meYS0KBPiOvIc59SQykoHfpJKgS2CMpGq8iCUkPwKFryOGHSHw/CklOZxFuOpJj+/mMK3g2OkjbpBJZy2YPjryEHSTNdd64VZucWoHBDPrx//TDh3huTC692IKPu8tVllUiSRmGuxdmuKEu8Qcf6PLsxj/TV+DMhKTwunD7KtxVlpUmfz84vwKmWO2TDfqaRJN1mb4bgcBdpUwn7JybJpoZ4WheXeGEONcQlSV+920m2eISEOTItvmIiouyrngH+9b2bLaLCHNFwCcKBfRWKCsNK0suFub7/W1BUONOISscLi72nNmvPPdTi/5NO9zl1pp5ziyZiV2eb7MTDUqeJNA5qv9SYkYHTYS0R1YKOLcpwCzRZg3dwFPL1ecIzHRrpRun+2/efqXIvLAVMfrxN2M6UCO7NJaLDPzHZV9fUaryY4kZfDXDSvAOjRHrnDgY2FxcJjhq/joiPU3EtsYZ70KcFW4qLiHCKctnvdtlq+ZIXWyE9L7Sns93DavUlhJBaPVKvnKoL8ZAq7cgCYYyEByBV2u2y9eNaNVceNQDHr3W7bNr980gLAPgDFU9nVf9zP90AAAAASUVORK5CYII="
}