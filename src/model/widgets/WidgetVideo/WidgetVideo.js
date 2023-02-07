/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetVideo extends WidgetItemElement {

    static widget = "Video";
    static type = "element";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADXUlEQVRoBe2Zb0gTYRzHv7tp0bQ5wQqhzigqtIIwYpUN55v+aJCGrmhKRLLI3rg3tVFQvsitV9obXwyifBGURPUiX+yVmgSZFEGwwN7MvS3Qqe2F/y5+l7dmd+futtvdjD5w7NHd7vns4bfvc/c8JqTA2l2HADTCWKIAXsfGBqblLJLSrN3VA6Bze/kW0GEU7z9FsCLeFBsb+Cyrwdpd91i7iwuPfOCMJj47x51uu8mxdtcUa3fZ1pKeevRs0HBhARI/3niDxDulfBnW7nICsDU31Bpcyn+wFhfhZO0R+vuc1PuM0KAT84mSNXwK/v7HzNxPRCYm+XbV3gpdvkzkWxQzswlYN1tQtWdn2vNF0iR8oaOLbz/vu4uj1VW5MU2hq6efTw3qi/pMB6PsssawcUOhzRcIOX2B0KoUEY00ZbS3vSXZ1oOWBieOVe8X9WezFtNkNwRg2hcIeYN+zxNZ6c72Zl1HVkFy0Ug/9gVC0aDfM5zX5SHBZazD9ODfFI20kB50CPKpcLEfmN9xDfPWNiwFXgHxRNbSlB7UH70qQX15xL4nRZcCLzF/wIvlp6NZi6sh+/SIJ7B4PQRTXxgFD9wwnahULSGXHnJolh7cl0ks1HeDcTtg9p+HiS1T/Fm19z2apweVykLNbc3qXQqRNKUHTal0UDsj4gm+3kl++c3HtFeg9KD+6DUj6XTpoQZKmsVLvVhs6ObLR47cp0cGLI9+xULNHf4HqwW63ntQvXNuhyhhDEsPRZRYAFYsZnh6yHbkdqDw3X1VUShHzu89GEclzP6mNSedvHlyoRGlSYZGOB1qn1xE0lpAsuaOU79rOAdomh7M2cMwB1tV160h6WE6WJHxzRIySI/syqPEgoJgq6K61RLV6UGjSSVAmElWg7rVJT34H5mG/FPrHnLk9bqHKuk8XPdYxbosj//SesGsbMoIGzR5Q/jtOIosm6RHOjY2QNLDXb39mT/IasyLwRFEJqLYxZZLXlhID29kIjp0pu2W7erFekWzUi6gQQuPjPPS+3az2FpWKtlL6j4iLafSXqJTWOgzgm1lpbywTGYPB/2eumROr+yQXpE60xcIcUZ9CSmUpof8zqm+8B5Kpb15IEyV8BBKpWnLgPaqhXg0AOq/Luj3GNV/lgD4BSS0axKI6w0yAAAAAElFTkSuQmCC";
    static cssClass = "widget-video";

    functions = {
        toggleCaptionAndDescriptions: function (model, videourl) {
            if (Utils.isIndieResource(videourl)) {
                $('#f-' + model.id + ' input[name="captions"]').parent().show();
                $('#f-' + model.id + ' input[name="descriptions"]').parent().show();
            } else {
                $('#f-' + model.id + ' input[name="captions"]').parent().hide();
                $('#f-' + model.id + ' input[name="descriptions"]').parent().hide();

            }
        },
        putOrDeleteCaptionAndDescriptions: function (model) {
            if (!Utils.isIndieResource(model.data.videourl)) {
                model.data.captions = "";
                model.data.descriptions = "";
            }
        }
    }

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetVideo.widget + "-" + Utils.generate_uuid(),
        };

        this.data = values?.data ? structuredClone(values.data) : { videourl: "", captions: "", descriptions: "", defaultCaptions: "0" };
    }

    clone() {
        return new WidgetVideo(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            return {
                inputs: form({
                    instanceId: this.id,
                    videourl: this.data.videourl,
                    captions: this.data.captions,
                    descriptions: this.data.descriptions,
                    defaultCaptions: this.data.defaultCaptions,
                    instanceName: this.params.name
                }),
                title: this.translate("widgets.Video.label")
            }
        });
    }

    preview() {
        return (this?.data?.videourl) ? this.params.name + ": " + this.data.videourl : this.translate("widgets.Video.prev");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetVideo.widget + "-" + this.id;
    }

    settingsClosed() {
        $(`#f-${this.id} input[name="videourl"]`).off('change');
    }

    settingsOpened() {
        const toggle = this.functions.toggleCaptionAndDescriptions;
        toggle(this, this.data.videourl);
        $('#f-' + this.id + ' input[name="videourl"]').on('change', function (e) {
            const videourl = e.target.value;
            toggle(this, videourl);
            $("#modal-settings-body .errors").html('');
        });
    }

    updateModelFromForm(form) {
        this.data.videourl = form.videourl;
        this.params.name = form.instanceName;
        this.data.captions = form.captions;
        this.data.descriptions = form.descriptions;
		this.data.defaultCaptions = form.defaultCaptions;
        this.functions.putOrDeleteCaptionAndDescriptions(this)
    }

    validateModel() {
        var keys = [];
        if (!Utils.isYoutubeVideoURL(this.data.videourl)) keys.push("Video.videourl.invalid");
        if (!Utils.isStringEmptyOrWhitespace(this.data.captions) && 
            !Utils.isIndieResource(this.data.captions))
            keys.push("common.captions.invalid");
        if (!Utils.isStringEmptyOrWhitespace(this.data.descriptions) && 
            !Utils.isIndieResource(this.data.descriptions))
            keys.push("common.descriptions.invalid");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (!Utils.isYoutubeVideoURL(form.videourl)) keys.push("Video.videourl.invalid");
        if (!Utils.isStringEmptyOrWhitespace(form.captions) && !Utils.isIndieResource(form.captions))
            keys.push("common.captions.invalid");
        if (!Utils.isStringEmptyOrWhitespace(form.descriptions) && !Utils.isIndieResource(form.descriptions))
            keys.push("common.descriptions.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
