import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetInteractiveVideo extends WidgetItemElement {

    static widget = "InteractiveVideo";
    static category = "interactiveElements";
    static icon = icon;
    params: { name: string }
    data: { videourl: string }

    constructor(values?: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { name: "Interactive Video-" + this.id }
        this.data = values?.data ? structuredClone(values.data) : { videourl: "" };
    }

    clone(): WidgetInteractiveVideo {
        const widget = new WidgetInteractiveVideo();
        widget.params = structuredClone(this.params);
        widget.params.name = "Interactive Video-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            videourl: this.data.videourl,
            instanceName: this.params.name
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.InteractiveVideo.label")
        };
    }

    preview(): string {
        return this.params?.name && this.data?.videourl ?
            this.params.name + ": " + this.data.videourl : this.translate("widgets.InteractiveVideo.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.videourl = form.videourl;
        this.params.name = form.instanceName;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!Utils.isInteractiveVideo(this.data.videourl))
            keys.push("InteractiveVideo.videourl.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (!Utils.isInteractiveVideo(form.videourl))
            keys.push("InteractiveVideo.videourl.invalid");
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }


}
