/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetVideoData, WidgetVideoData, WidgetVideoParams } from "../../../types";

export default class WidgetVideo extends WidgetItemElement {

    static widget = "Video";
    static category = "simpleElements";
    static icon = icon;

    static async create(values?: InputWidgetVideoData): Promise<WidgetVideo> {
        return new WidgetVideo(values);
    }

    private toggleCaptionAndDescriptions(videourl: string) {
        if (Utils.isValidResource(videourl)) {
            $('#f-' + this.id + ' input[name="captions"]').parent().show();
            $('#f-' + this.id + ' input[name="descriptions"]').parent().show();
        } else {
            $('#f-' + this.id + ' input[name="captions"]').parent().hide();
            $('#f-' + this.id + ' input[name="descriptions"]').parent().hide();

        }
    }

    private putOrDeleteCaptionAndDescriptions() {
        if (!Utils.isValidResource(this.data.videourl)) {
            this.data.captions = "";
            this.data.descriptions = "";
        }
    }

    params: WidgetVideoParams;
    data: WidgetVideoData;

    constructor(values?: InputWidgetVideoData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: WidgetVideo.widget + "-" + this.id,
        };

        this.data = values?.data ? structuredClone(values.data) : { videourl: "", captions: "", descriptions: "", defaultCaptions: "0" };
    }

    clone(): WidgetVideo {
        const widget = new WidgetVideo();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetVideo.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
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
        };
    }

    preview(): string {
        return (this?.data?.videourl) ? this.params.name + ": " + this.data.videourl : this.translate("widgets.Video.prev");
    }

    settingsClosed(): void {
        $(`#f-${this.id} input[name="videourl"]`).off('change');
    }

    settingsOpened(): void {
        const model = this;
        model.toggleCaptionAndDescriptions(this.data.videourl);
        $('#f-' + model.id + ' input[name="videourl"]').on('change', function (e) {
            const videourl = (<HTMLInputElement>e.target).value;
            model.toggleCaptionAndDescriptions(videourl);
            $("#modal-settings-body .errors").html('');
        });
    }

    updateModelFromForm(form: any): void {
        this.data.videourl = form.videourl;
        this.params.name = form.instanceName;
        this.data.captions = form.captions;
        this.data.descriptions = form.descriptions;
        this.data.defaultCaptions = form.defaultCaptions;
        this.putOrDeleteCaptionAndDescriptions()
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!Utils.isYoutubeVideoURL(this.data.videourl)) keys.push("Video.videourl.invalid");
        if (!Utils.isStringEmptyOrWhitespace(this.data.captions) &&
            !Utils.isValidResource(this.data.captions))
            keys.push("common.captions.invalid");
        if (!Utils.isStringEmptyOrWhitespace(this.data.descriptions) &&
            !Utils.isValidResource(this.data.descriptions))
            keys.push("common.descriptions.invalid");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (!Utils.isYoutubeVideoURL(form.videourl)) keys.push("Video.videourl.invalid");
        if (!Utils.isStringEmptyOrWhitespace(form.captions) && !Utils.isValidResource(form.captions))
            keys.push("common.captions.invalid");
        if (!Utils.isStringEmptyOrWhitespace(form.descriptions) && !Utils.isValidResource(form.descriptions))
            keys.push("common.descriptions.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
