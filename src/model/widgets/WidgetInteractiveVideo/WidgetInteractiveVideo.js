import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetInteractiveVideo extends WidgetItemElement {
    
    static widget = "InteractiveVideo";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-interactive-video";
    
    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { name: "Interactive Video-" + Utils.generate_uuid() }
        this.data = values?.data ? structuredClone(values.data) : { videourl: "" };
    }

    clone() {
        return new WidgetInteractiveVideo(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                videourl: this.data.videourl,
                instanceName: this.params.name
            };

            return {
                inputs: form(data),
                title: this.translate("widgets.InteractiveVideo.label")
            };
        });
    }

    preview() {
        return this.params?.name && this.data?.videourl ? 
            this.params.name + ": " + this.data.videourl : this.translate("widgets.InteractiveVideo.prev");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = "Interactive Video-" + this.id;
    }

    updateModelFromForm(form) {
        this.data.videourl = form.videourl;
        this.params.name = form.instanceName;
    }

    validateModel() {
        var keys = [];
        if (!Utils.isInteractiveVideo(this.data.videourl))
            keys.push("InteractiveVideo.videourl.invalid");
        return keys;
    }

    validateForm(formData) {
        var keys = [];
        if (!Utils.isInteractiveVideo(formData.videourl))
            keys.push("InteractiveVideo.videourl.invalid");
        if (formData.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }


}
