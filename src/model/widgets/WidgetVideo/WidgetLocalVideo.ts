/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { InputWidgetVideoData } from "../../../types";
import WidgetVideo from "./WidgetVideo";

export default class WidgetLocalVideo extends WidgetVideo {

    static async create(values?: InputWidgetVideoData): Promise<WidgetLocalVideo> {
        return new WidgetLocalVideo(values);
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isYoutubeVideoURL(this.data.videourl))
            errors.push("Video.videourl.localInvalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors: string[] = super.validateForm(form);
        if (!Utils.isYoutubeVideoURL(form.videourl))
            errors.push("Video.videourl.localInvalid");
        return errors;
    }
}
