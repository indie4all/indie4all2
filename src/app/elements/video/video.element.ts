/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetVideoData, WidgetInitOptions, WidgetVideoData, WidgetVideoParams } from "../../../types";
import ItemElement from "../item/item.element";

export default abstract class VideoElement extends ItemElement {

    static widget = "Video";
    static category = "simpleElements";
    static icon = icon;

    params: WidgetVideoParams;
    data: WidgetVideoData;

    constructor() { super(); }

    async init(values?: InputWidgetVideoData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: VideoElement.widget + "-" + this.id,
        };
        if (options.regenerateId) this.params.name = VideoElement.widget + "-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : { videourl: "", captions: "", descriptions: "", defaultCaptions: "0" };
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            videourl: this.data.videourl,
            captions: this.data.captions,
            descriptions: this.data.descriptions,
            defaultCaptions: this.data.defaultCaptions,
            instanceName: this.params.name
        }));
    }

    get texts() { return { name: this.params.name } }

    get preview(): string {
        return (this?.data?.videourl) ? this.params.name + ": " + this.data.videourl : this.translate("widgets.Video.prev");
    }

    settingsClosed(): void { }

    settingsOpened(): void { }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        this.data.videourl = form.videourl;
        this.params.name = form.instanceName;
        this.data.captions = form.captions;
        this.data.descriptions = form.descriptions;
        this.data.defaultCaptions = form.defaultCaptions;
    }

    set texts(texts: any) { this.params.name = texts.name; }

    validateModel(): string[] {
        var keys: string[] = [];
        if (!this.utils.isStringEmptyOrWhitespace(this.data.captions) &&
            !this.utils.isValidResource(this.data.captions))
            keys.push("common.captions.invalid");
        if (!this.utils.isStringEmptyOrWhitespace(this.data.descriptions) &&
            !this.utils.isValidResource(this.data.descriptions))
            keys.push("common.descriptions.invalid");
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (!this.utils.isStringEmptyOrWhitespace(form.captions) && !this.utils.isValidResource(form.captions))
            keys.push("common.captions.invalid");
        if (!this.utils.isStringEmptyOrWhitespace(form.descriptions) && !this.utils.isValidResource(form.descriptions))
            keys.push("common.descriptions.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
