indieauthor.widgets.Video = {
    widgetConfig: {
        widget: "Video",
        type: "element",
        label: "Video",
        category: "simpleElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function () {
        var itemTemplate = '<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}"> <img src="' + this.icon + '" class="img-fluid"/> <br/> <span> {{translate "widgets.Video.label"}}</span></div>';
        var item = {};
        item.content = indieauthor.renderTemplate(itemTemplate, this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function () {
        return '<div class="widget widget-video" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"> <div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"></div><div class="b2" data-prev><span>{{translate "widgets.Video.prev"}}</span></div><div class="b3" data-toolbar> </div></div';
    },
    getInputs: function (modelValues) {
                var inputTemplate = `
            <form id="f-{{instanceId}}">
                <div class="form-group">
                    <label for="instanceName">{{translate "common.name.label"}}</label>
                    <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/>
                    <small class="form-text text-muted">{{translate "common.name.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="text">{{translate "widgets.Video.form.url.label"}}</label>
                    <input type="url" class="form-control" name="videourl" placeholder="{{translate "widgets.Video.form.url.placeholder"}}" value="{{{videourl}}}" autocomplete="off" required></input>
                    <small class="form-text text-muted">{{translate "widgets.Video.form.url.help"}}</small>
                </div>
				<fieldset class="form-group">
                  <div class="row">
                    <legend class="col-form-label col-12 pt-0">{{translate "widgets.Video.form.defaultCaptions.label"}}</legend>
                    <div class="col-12">
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="defaultCaptions" id="defaultCaptions-yes" value="1" {{#ifeq defaultCaptions "1"}} checked {{/ifeq}} required>
                        <label class="form-check-label" for="defaultCaptions-yes">
                        {{translate "widgets.Video.form.defaultCaptions.yes"}}
                        </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="defaultCaptions" id="defaultCaptions-no" value="0" {{#ifneq defaultCaptions "1"}} checked {{/ifneq}} required>
                        <label class="form-check-label" for="defaultCaptions-no">
                        {{translate "widgets.Video.form.defaultCaptions.no"}}
                        </label>
                    </div>
                    </div>
                  </div>
                </fieldset>
                <div class="form-group">
                    <label for="captions">{{translate "common.captions.label"}}</label>
                    <input type="url" class="form-control" name="captions" placeholder="{{translate "common.captions.placeholder"}}" value="{{{captions}}}" autocomplete="off"></input>
                    <small class="form-text text-muted">{{translate "common.captions.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="descriptions">{{translate "common.descriptions.label"}}</label>
                    <input type="url" class="form-control" name="descriptions" placeholder="{{translate "common.descriptions.placeholder"}}" value="{{{descriptions}}}" autocomplete="off"></input>
                    <small class="form-text text-muted">{{translate "common.descriptions.help"}}</small>
                </div>
            </form>`;

        var rendered = indieauthor.renderTemplate(inputTemplate, {
            instanceId: modelValues.id,
            videourl: modelValues.data.videourl,
            captions: modelValues.data.captions,
            descriptions: modelValues.data.descriptions,
			defaultCaptions: modelValues.data.defaultCaptions,
            instanceName: modelValues.params.name
        });

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.Video.label
        };
    },
    settingsClosed: function (modelObject) {
        $(`#f-${modelObject.id} input[name="videourl"]`).off('change');
    },
    settingsOpened: function (modelObject) {
        const toggle = this.functions.toggleCaptionAndDescriptions;
        toggle(modelObject, modelObject.data.videourl);

        $('#f-' + modelObject.id + ' input[name="videourl"]').on('change', function (e) {
            const videourl = e.target.value;
            toggle(modelObject, videourl);
            $("#modal-settings-body .errors").html('');
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = (modelObject.data.videourl) ? modelObject.params.name + ": " + modelObject.data.videourl : indieauthor.strings.widgets.Video.prev;
    },
    emptyData: function () {
        return {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
            },
            data: {
                videourl: "",
                captions: "",
                descriptions: "",
                defaultCaptions: "0"
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.videourl = formJson.videourl;
        modelObject.params.name = formJson.instanceName;
        modelObject.data.captions = formJson.captions;
        modelObject.data.descriptions = formJson.descriptions;
		modelObject.data.defaultCaptions = formJson.defaultCaptions;
        this.functions.putOrDeleteCaptionAndDescriptions(modelObject)
    },
    validateModel: function (widgetInstance) {
        var keys = [];

        if (!indieauthor.utils.isYoutubeVideoURL(widgetInstance.data.videourl))
            keys.push("Video.videourl.invalid");

        if (!indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.captions) && !indieauthor.utils.isIndieResource(widgetInstance.data.captions))
            keys.push("common.captions.invalid");

        if (!indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.descriptions) && !indieauthor.utils.isIndieResource(widgetInstance.data.descriptions))
            keys.push("common.descriptions.invalid");

        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            keys.push("common.name.notUniqueName");

        if (keys.length > 0) {
            return {
                element: widgetInstance.id,
                keys: keys
            }
        }

        return undefined;
    },
    validateForm: function (formData, instanceId) {
        var keys = [];

        if (!indieauthor.utils.isYoutubeVideoURL(formData.videourl))
            keys.push("Video.videourl.invalid");

        if (!indieauthor.utils.isStringEmptyOrWhitespace(formData.captions) && !indieauthor.utils.isIndieResource(formData.captions))
            keys.push("common.captions.invalid");

        if (!indieauthor.utils.isStringEmptyOrWhitespace(formData.descriptions) && !indieauthor.utils.isIndieResource(formData.descriptions))
            keys.push("common.descriptions.invalid");

        if (formData.instanceName.length == 0)
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(formData.instanceName, instanceId))
            keys.push("common.name.notUniqueName");

        return keys;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADXUlEQVRoBe2Zb0gTYRzHv7tp0bQ5wQqhzigqtIIwYpUN55v+aJCGrmhKRLLI3rg3tVFQvsitV9obXwyifBGURPUiX+yVmgSZFEGwwN7MvS3Qqe2F/y5+l7dmd+futtvdjD5w7NHd7vns4bfvc/c8JqTA2l2HADTCWKIAXsfGBqblLJLSrN3VA6Bze/kW0GEU7z9FsCLeFBsb+Cyrwdpd91i7iwuPfOCMJj47x51uu8mxdtcUa3fZ1pKeevRs0HBhARI/3niDxDulfBnW7nICsDU31Bpcyn+wFhfhZO0R+vuc1PuM0KAT84mSNXwK/v7HzNxPRCYm+XbV3gpdvkzkWxQzswlYN1tQtWdn2vNF0iR8oaOLbz/vu4uj1VW5MU2hq6efTw3qi/pMB6PsssawcUOhzRcIOX2B0KoUEY00ZbS3vSXZ1oOWBieOVe8X9WezFtNkNwRg2hcIeYN+zxNZ6c72Zl1HVkFy0Ug/9gVC0aDfM5zX5SHBZazD9ODfFI20kB50CPKpcLEfmN9xDfPWNiwFXgHxRNbSlB7UH70qQX15xL4nRZcCLzF/wIvlp6NZi6sh+/SIJ7B4PQRTXxgFD9wwnahULSGXHnJolh7cl0ks1HeDcTtg9p+HiS1T/Fm19z2apweVykLNbc3qXQqRNKUHTal0UDsj4gm+3kl++c3HtFeg9KD+6DUj6XTpoQZKmsVLvVhs6ObLR47cp0cGLI9+xULNHf4HqwW63ntQvXNuhyhhDEsPRZRYAFYsZnh6yHbkdqDw3X1VUShHzu89GEclzP6mNSedvHlyoRGlSYZGOB1qn1xE0lpAsuaOU79rOAdomh7M2cMwB1tV160h6WE6WJHxzRIySI/syqPEgoJgq6K61RLV6UGjSSVAmElWg7rVJT34H5mG/FPrHnLk9bqHKuk8XPdYxbosj//SesGsbMoIGzR5Q/jtOIosm6RHOjY2QNLDXb39mT/IasyLwRFEJqLYxZZLXlhID29kIjp0pu2W7erFekWzUi6gQQuPjPPS+3az2FpWKtlL6j4iLafSXqJTWOgzgm1lpbywTGYPB/2eumROr+yQXpE60xcIcUZ9CSmUpof8zqm+8B5Kpb15IEyV8BBKpWnLgPaqhXg0AOq/Luj3GNV/lgD4BSS0axKI6w0yAAAAAElFTkSuQmCC",
    functions: {
        toggleCaptionAndDescriptions: function (modelObject, videourl) {
            if (indieauthor.utils.isIndieResource(videourl)) {
                $('#f-' + modelObject.id + ' input[name="captions"]').parent().show();
                $('#f-' + modelObject.id + ' input[name="descriptions"]').parent().show();
            } else {
                $('#f-' + modelObject.id + ' input[name="captions"]').parent().hide();
                $('#f-' + modelObject.id + ' input[name="descriptions"]').parent().hide();

            }
        },
        putOrDeleteCaptionAndDescriptions: function (modelObject) {
            if (!indieauthor.utils.isIndieResource(modelObject.data.videourl)) {
                modelObject.data.captions = "";
                modelObject.data.descriptions = "";
            }
        }
    }
}