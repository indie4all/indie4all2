/* global $ */
import "./styles.scss";
import VideoElement from "./video.element";

export default class VideoLocalElement extends VideoElement {

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isYoutubeVideoURL(this.data.videourl))
            errors.push("Video.videourl.localInvalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors: string[] = super.validateForm(form);
        if (!this.utils.isYoutubeVideoURL(form.videourl))
            errors.push("Video.videourl.localInvalid");
        return errors;
    }
}
