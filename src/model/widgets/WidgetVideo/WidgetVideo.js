/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetVideo extends WidgetItemElement {

    static widget = "Video";
    static type = "element";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = icon;
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
