/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { InputWidgetVideoData } from "../../../types";
import WidgetVideo from "./WidgetVideo";

export default class WidgetRemoteVideo extends WidgetVideo {

    private toggleCaptionAndDescriptions(videourl: string) {
        const valid = Utils.isValidResource(videourl);
        $('#f-' + this.id + ' input[name="captions"]').parent().toggleClass('d-none', !valid);
        $('#f-' + this.id + ' input[name="descriptions"]').parent().toggleClass('d-none', !valid);
    }

    private putOrDeleteCaptionAndDescriptions() {
        if (!Utils.isValidResource(this.data.videourl)) {
            this.data.captions = "";
            this.data.descriptions = "";
        }
    }

    static async create(values?: InputWidgetVideoData): Promise<WidgetRemoteVideo> {
        return new WidgetRemoteVideo(values);
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
