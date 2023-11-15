/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { InputWidgetVideoData } from "../../../types";
import WidgetVideo from "./WidgetVideo";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteVideo extends HasFilePickerElement(WidgetVideo) {

    private toggleCaptionAndDescriptions(videourl: string) {
        const valid = Utils.isValidResource(videourl);
        $('#f-' + this.id + ' input[name="captions"]').closest('.form-group').toggleClass('d-none', !valid);
        $('#f-' + this.id + ' input[name="descriptions"]').closest('.form-group').toggleClass('d-none', !valid);
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
