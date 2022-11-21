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
            text: modelObject.data.text,
            alt: modelObject.data.alt,
            blob: modelObject.data.blob,
            audioblob: modelObject.data.audioblob,
            captionsblob: modelObject.data.captionsblob
        }

        var template = `
        <form id="f-{{instanceId}}">
          <div class="form-group">
            <label>{{translate "widgets.ImageAndSoundItem.form.audio.label"}}</label>
            <input type="file" class="form-control" name="audio" accept="audio/3gpp, audio/3gpp2, audio/aac, audio/ogg, audio/opus, audio/mp4, audio/mpeg, audio/vnd.wav, audio/vorbis, audio/wave, audio/x-aiff" />
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
            <input type="file" class="form-control" name="image" accept="image/png, image/jpeg" />
            <small class="form-text text-muted">{{translate "widgets.ImageAndSoundItem.form.image.help"}}</small>
            <input type="hidden" name="blob" value="{{blob}}" />
          </div>
          <div class="form-group">
            <label for="alt">{{translate "common.alt.label"}}</label>
            <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
            <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
          </div>
          <div class="form-group d-none">
            <p>{{translate "widgets.ImageAndSoundItem.form.preview"}}</p>
            <img class="img-fluid img-preview" src="{{blob}}"/>
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
            title: indieauthor.strings.widgets.ImageAndSoundItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        let $form = $('#f-' + modelObject.id);
        const $iImg = $form.find('input[name=image]');
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iBlob = $form.find('input[name=blob]');
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !modelObject.data.blob);
        $iAudio.prop('required', !modelObject.data.audioblob);
        $iCaptions.prop('required', !modelObject.data.captionsblob);
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
        element.innerHTML = modelObject.data.text ? modelObject.data.text : indieauthor.strings.widgets.ImageAndSoundItem.prev;
    },
    emptyData: function (options) {
        return {
            data: {
                text: "",
                alt: "",
                blob: "",
                audioblob: "",
                captionsblob: ""
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.audioblob = formJson.audioblob;
        modelObject.data.captionsblob = formJson.captionsblob;
        modelObject.data.blob = formJson.blob;
        modelObject.data.text = formJson.text;
        modelObject.data.alt = formJson.alt;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.audioblob)) 
            errors.push("common.audioblob.invalid");
        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.blob)) 
            errors.push("common.imageblob.invalid");
        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.captionsblob))
            errors.push("common.captionsblob.invalid");

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

        if (!indieauthor.utils.isValidBase64DataUrl(formData.audioblob)) 
            errors.push("common.audioblob.invalid");

        if (!indieauthor.utils.isValidBase64DataUrl(formData.blob)) 
            errors.push("common.imageblob.invalid");

        if (!indieauthor.utils.isValidBase64DataUrl(formData.captionsblob))
            errors.push("common.captionsblob.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            errors.push("common.alt.invalid")

        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADlUlEQVRoge2Zb0gTYRjAnztn4TQ3wwohLikkJxWRxCIc6pfKDLKQFZRJfxhkXzaC3IqwPx/cl7AIDAZRfShSgvqQwvrinxloUkjGFvbFjaAPBjr/fSl38bzbXZu7neftdrfCHxzvu+3u3t/ePc9zt3spiIMxW/cCQANoyyQAvAmNdM+ksuClGbO1AwDsW0s2AW5aMfzJDzHxE6GR7rGUGozZeosxW1nvwAdWa8Jz8+yRpmssY7ZOM2arUUx6+vHLHs2FOVD8YMMVFLcL+dKM2VoDAMbG+mqNQ/kvhQX5cKh6P74+LvQ5zXVwx2zCIOJDZ5WpRP5JaV3aZwgvwu/LHtKuFqq+EnJaDqc8av26XKOz3YM5N+Z22fi6nbb0UqcXIm8/yjvYFxCVNhYW4MWuDwBmnO0eh9tlewpqhgfFFENu73XQvRCsYiuB9fpJbNYzI617ZEuQy3GfhdwvHRDxfY2GknyaQZGYFhCmz1gSYzw0Bb92OUiXPlYJdJWJhBU7Hlzt6UtBSWmUpSwmEgYEgx6o3duIGBteBF3vDaAMeoj4AsAOBYANTckfSynpBOEYtKUclsaDJFHZzyE5MyuIYjHN+gJJ71FVpmgnFiq0xUTCI8d1kvQ1l44MJUvHi1F7GPIlSMhgeASzIDz4meYS0KBPiOvIc59SQykoHfpJKgS2CMpGq8iCUkPwKFryOGHSHw/CklOZxFuOpJj+/mMK3g2OkjbpBJZy2YPjryEHSTNdd64VZucWoHBDPrx//TDh3huTC692IKPu8tVllUiSRmGuxdmuKEu8Qcf6PLsxj/TV+DMhKTwunD7KtxVlpUmfz84vwKmWO2TDfqaRJN1mb4bgcBdpUwn7JybJpoZ4WheXeGEONcQlSV+920m2eISEOTItvmIiouyrngH+9b2bLaLCHNFwCcKBfRWKCsNK0suFub7/W1BUONOISscLi72nNmvPPdTi/5NO9zl1pp5ziyZiV2eb7MTDUqeJNA5qv9SYkYHTYS0R1YKOLcpwCzRZg3dwFPL1ecIzHRrpRun+2/efqXIvLAVMfrxN2M6UCO7NJaLDPzHZV9fUaryY4kZfDXDSvAOjRHrnDgY2FxcJjhq/joiPU3EtsYZ70KcFW4qLiHCKctnvdtlq+ZIXWyE9L7Sns93DavUlhJBaPVKvnKoL8ZAq7cgCYYyEByBV2u2y9eNaNVceNQDHr3W7bNr980gLAPgDFU9nVf9zP90AAAAASUVORK5CYII="
}