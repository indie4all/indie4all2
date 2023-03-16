/* global $ */
import Utils from "../../../Utils";
import './styles.scss';
import icon from "./icon.png";
import { FormEditData } from "../../../types";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";

export default class WidgetAudioTermItem extends WidgetSpecificItemElement {

    static widget = "AudioTermItem";
    static category = "interactiveElements";
    static icon = icon;
    static cssClass = "widget-audio-term-item";
    static paletteHidden = true;
    data: { term: string, definition: string, audioblob: string, captionsblob: string };

    constructor(values?: any) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { term: "", definition: "", audioblob: "", captionsblob: "" };
    }

    clone(): WidgetAudioTermItem {
        const widget = new WidgetAudioTermItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = {
            instanceId: this.id,
            term: this.data.term,
            definition: this.data.definition,
            audioblob: this.data.audioblob,
            captionsblob: this.data.captionsblob
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.AudioTermItem.label")
        };
    }

    settingsOpened(): void {
        let $form = $('#f-' + this.id);
        const $iAudio = $form.find('input[name=audio]');
        const $iCaptions = $form.find('input[name=captions]')
        const $iAudioBlob = $form.find('input[name=audioblob]');
        const $iCaptionsBlob = $form.find('input[name=captionsblob]');
        $iAudio.prop('required', !this.data.audioblob);
        $iCaptions.prop('required', !this.data.captionsblob);

        $iAudio.on('change', function () {
            const self = <HTMLInputElement>this;
            $iAudioBlob.val('');
            $iAudio.prop('required', true);
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    if (value) {
                        $iAudio.prop('required', false);
                        $iAudioBlob.val(value.toString());
                    }
                });
            }
        });

        $iCaptions.on('change', function () {
            const self = <HTMLInputElement>this;
            $iCaptionsBlob.val('');
            $iCaptions.prop('required', true);
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    if (value) {
                        $iCaptions.prop('required', false);
                        $iCaptionsBlob.val(value.toString());
                    }
                });
            }
        });
    }

    preview(): string {
        return this.data?.term && this.data?.definition ?
            this.data.term + " -> " + this.data.definition :
            this.translate("widgets.AudioTermItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.term = form.term;
        this.data.definition = form.definition;
        this.data.audioblob = form.audioblob;
        this.data.captionsblob = form.captionsblob;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (this.data.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (form.term.length == 0) errors.push("AudioTermItem.term.invalid");
        if (form.definition.length == 0) errors.push("AudioTermItem.definition.invalid");
        if (!Utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }
}
