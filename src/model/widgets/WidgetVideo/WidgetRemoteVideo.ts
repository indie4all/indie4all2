/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { InputWidgetVideoData } from "../../../types";
import WidgetVideo from "./WidgetVideo";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import Config from "../../../Config";
import I18n from "../../../I18n";

export default class WidgetRemoteVideo extends HasFilePickerElement(WidgetVideo) {

    private toggleCaptionAndDescriptions(videourl: string) {
        const valid = !Utils.isRelativeURL(videourl) && Utils.isValidResource(videourl);
        $('#f-' + this.id + ' input[name="captions"]').closest('.form-group').toggleClass('d-none', !valid);
        $('#f-' + this.id + ' input[name="descriptions"]').closest('.form-group').toggleClass('d-none', !valid);
    }

    private putOrDeleteCaptionAndDescriptions() {
        if (Utils.isRelativeURL(this.data.videourl) || !Utils.isValidResource(this.data.videourl)) {
            this.data.captions = "";
            this.data.descriptions = "";
        }
    }

    static async create(values?: InputWidgetVideoData): Promise<WidgetRemoteVideo> {
        return new WidgetRemoteVideo(values);
    }

    clone(): WidgetRemoteVideo {
        const widget = new WidgetRemoteVideo();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetRemoteVideo.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    settingsClosed(): void {
        $(`#f-${this.id} input[name="videourl"]`).off('change');
    }

    settingsOpened(): void {
        const model = this;
        model.toggleCaptionAndDescriptions(this.data.videourl);
        $('#f-' + model.id + ' input[name="videourl"]').on('change', async function (e) {
            $("#modal-settings-body .errors").html('');
            let videourl = (<HTMLInputElement>e.target).value;
            if (!Utils.isPublicMediaVideoURL(videourl)) {
                // Legacy videos can use captions and descriptions
                model.toggleCaptionAndDescriptions(videourl);
                return;
            }
            const { default: alertErrorTemplate } = await import("../../../views/alertError.hbs");
            const i18n = I18n.getInstance();
            const mediaResourcesURL = Config.getMediaResourcesURL();
            const id = Utils.getPublicMediaVideoId(videourl);
            // Media endpoint not configured
            if (!mediaResourcesURL) {
                $("#modal-settings-body .errors").html(alertErrorTemplate({
                    errorText: i18n.value("errors.Video.videourl.public.notConfigured")
                }));
                $(this).val('');
                return;
            }
            if (!id) {
                $("#modal-settings-body .errors").html(alertErrorTemplate({ errorText: i18n.value("errors.Video.videourl.public.invalidId") }));
                $(this).val('');
                return;
            }
            // Get video info
            const headers = new Headers();
            headers.append("Accept", "application/json");
            const response = await fetch(`${mediaResourcesURL}/content/public/video/info/${id}`, { headers });
            // Cannot retrieve video info or it is not a public video
            if (response.status !== 200) {
                $("#modal-settings-body .errors").html(alertErrorTemplate({ errorText: i18n.value("errors.Video.videourl.public.notFound") }));
                $(this).val('');
                return;
            }
            // Get the real video url using the endpointTranscoded value
            const info = await response.json();
            videourl = `${mediaResourcesURL}/content/${info.endpointTranscoded}`;
            $(this).val(videourl);
        });
        this.initFilePicker($('#f-' + model.id + ' input[name="videourl"]'), false);
        this.initFilePicker($('#f-' + model.id + ' input[name="captions"]'));
        this.initFilePicker($('#f-' + model.id + ' input[name="descriptions"]'));
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.putOrDeleteCaptionAndDescriptions()
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isYoutubeVideoURL(this.data.videourl) &&
            !Utils.isValidVideoResource(this.data.videourl))
            errors.push("Video.videourl.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors: string[] = super.validateForm(form);
        if (!Utils.isYoutubeVideoURL(form.videourl) &&
            !Utils.isValidVideoResource(form.videourl))
            errors.push("Video.videourl.invalid");
        return errors;
    }
}
