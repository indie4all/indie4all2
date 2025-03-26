/* global $ */
import "./styles.scss";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import Config from "../../../config";
import VideoElement from "./video.element";

export default class VideoRemoteElement extends HasFilePickerElement(VideoElement) {

    private toggleCaptionAndDescriptions(videourl: string) {
        const valid = !this.utils.isRelativeURL(videourl) && this.utils.isValidResource(videourl);
        const form = document.querySelector(`#f-${this.id}`) as HTMLFormElement;
        form.querySelector('input[name="captions"]').closest('.captions-wrapper').classList.toggle('d-none', !valid);
        form.querySelector('input[name="descriptions"]').closest('.descriptions-wrapper').classList.toggle('d-none', !valid);
    }

    private putOrDeleteCaptionAndDescriptions() {
        if (this.utils.isRelativeURL(this.data.videourl) || !this.utils.isValidResource(this.data.videourl)) {
            this.data.captions = "";
            this.data.descriptions = "";
        }
    }

    settingsClosed(): void {
        $(`#f-${this.id} input[name="videourl"]`).off('change');
    }

    settingsOpened(): void {
        const model = this;
        model.toggleCaptionAndDescriptions(this.data.videourl);
        $('#f-' + model.id + ' input[name="videourl"]').on('change', async (e) => {
            $(".widget-editor-body .errors").html('');
            let videourl = (<HTMLInputElement>e.target).value;
            if (!this.utils.isPublicMediaVideoURL(videourl)) {
                // Legacy videos can use captions and descriptions
                model.toggleCaptionAndDescriptions(videourl);
                return;
            }
            const mediaResourcesURL = Config.getMediaResourcesURL();
            const id = this.utils.getPublicMediaVideoId(videourl);
            // Media endpoint not configured
            if (!mediaResourcesURL) {
                const errorsPlaceholder = document.querySelector('.widget-editor-body .errors') as HTMLElement;
                this.alert.danger(errorsPlaceholder, this.i18n.value("errors.Video.videourl.public.notConfigured"));
                $(this).val('');
                return;
            }
            if (!id) {
                const errorsPlaceholder = document.querySelector('.widget-editor-body .errors') as HTMLElement;
                this.alert.danger(errorsPlaceholder, this.i18n.value("errors.Video.videourl.public.invalidId"));
                $(this).val('');
                return;
            }
            // Get video info
            const headers = new Headers();
            headers.append("Accept", "application/json");
            const response = await fetch(`${mediaResourcesURL}/content/public/video/info/${id}`, { headers });
            // Cannot retrieve video info or it is not a public video
            if (response.status !== 200) {
                const errorsPlaceholder = document.querySelector('.widget-editor-body .errors') as HTMLElement;
                this.alert.danger(errorsPlaceholder, this.i18n.value("errors.Video.videourl.public.notFound"));
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
        if (!this.utils.isYoutubeVideoURL(this.data.videourl) &&
            !this.utils.isValidVideoResource(this.data.videourl))
            errors.push("Video.videourl.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors: string[] = super.validateForm(form);
        if (!this.utils.isYoutubeVideoURL(form.videourl) &&
            !this.utils.isValidVideoResource(form.videourl))
            errors.push("Video.videourl.invalid");
        return errors;
    }
}
