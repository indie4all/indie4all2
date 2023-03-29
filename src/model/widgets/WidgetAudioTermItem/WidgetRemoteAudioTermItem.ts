/* global $ */
import Utils from "../../../Utils";
import './styles.scss';
import { FormEditData, InputWidgetAudioTermItemData } from "../../../types";
import WidgetAudioTermItem from "./WidgetAudioTermItem";

export default class WidgetRemoteAudioTermItem extends WidgetAudioTermItem {

    static async create(values?: InputWidgetAudioTermItemData): Promise<WidgetRemoteAudioTermItem> {
        // TODO Local to remote resources
        if (!values?.data?.captions && values?.data?.captionsblob)
            throw new Error("Conversion from Local to Remote is not currently supported");
        if (!values?.data?.audio && values?.data?.audioblob)
            throw new Error("Conversion from Local to Remote is not currently supported");

        return new WidgetRemoteAudioTermItem(values);
    }

    constructor(values?: InputWidgetAudioTermItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { term: "", definition: "", audio: "", captions: "" };
    }

    clone(): WidgetRemoteAudioTermItem {
        const widget = new WidgetRemoteAudioTermItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        const data = {
            instanceId: this.id,
            term: this.data.term,
            definition: this.data.definition,
            audio: this.data.audio,
            captions: this.data.captions
        };
        return { inputs: form(data), title: this.translate("widgets.AudioTermItem.label") };
    }

    settingsOpened(): void { }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.audio = form.audio;
        this.data.captions = form.captions;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isStringEmptyOrWhitespace(this.data.captions) && !Utils.isIndieResource(this.data.captions))
            errors.push("common.captions.invalid");
        if (!Utils.isIndieResource(this.data.audio))
            errors.push("AudioTermItem.audio.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors: string[] = super.validateForm(form);
        if (!Utils.isStringEmptyOrWhitespace(form.captions) && !Utils.isIndieResource(form.captions))
            errors.push("common.captions.invalid");
        if (!Utils.isIndieResource(form.audio))
            errors.push("AudioTermItem.audio.invalid");
        return errors;
    }
}
