/* global $ */
import Utils from "../../../Utils";
import './styles.scss';
import { FormEditData, InputWidgetAudioTermItemData } from "../../../types";
import Config from "../../../Config";
import WidgetAudioTermItem from "./WidgetAudioTermItem";

export default class WidgetLocalAudioTermItem extends WidgetAudioTermItem {

    static async create(values?: InputWidgetAudioTermItemData): Promise<WidgetLocalAudioTermItem> {
        if (!values?.data?.audioblob && values?.data?.audio) {
            const url = Utils.resourceURL(values.data.audio);
            values.data.audioblob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.audio;
        }
        if (!values?.data?.captionsblob && values?.data?.captions) {
            const url = Utils.resourceURL(values.data.captions);
            values.data.captionsblob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.captions;
        }
        return new WidgetLocalAudioTermItem(values);
    }

    constructor(values?: InputWidgetAudioTermItemData) {
        super(values);
        this.data = values.data ? structuredClone(values?.data) : { term: "", definition: "", audioblob: "", captionsblob: "" };
    }

    clone(): WidgetLocalAudioTermItem {
        const widget = new WidgetLocalAudioTermItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
        const data = {
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
        if (!Config.isLocal()) return;

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

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.audioblob = form.audioblob;
        this.data.captionsblob = form.captionsblob;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!Utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }
}