import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { FormEditData } from "../../../types";

export default class WidgetInteractiveVideo extends WidgetItemElement {

    static widget = "InteractiveVideo";
    static type = "element";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-interactive-video";
    params: { name: string }
    data: { videourl: string }

    constructor(values: any) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { name: "Interactive Video-" + Utils.generate_uuid() }
        this.data = values?.data ? structuredClone(values.data) : { videourl: "" };
    }

    clone(): WidgetInteractiveVideo {
        return new WidgetInteractiveVideo(this);
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

    regenerateIDs(): void {
        super.regenerateIDs();
        this.params.name = "Interactive Video-" + this.id;
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
