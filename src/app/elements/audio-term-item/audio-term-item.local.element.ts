/* global $ */
import './styles.scss';
import { InputWidgetAudioTermItemData } from "../../../types";
import Config from "../../../config";
import AudioTermItemElement from "./audio-term-item.element";

export default class AudioTermItemLocalElement extends AudioTermItemElement {

    constructor() { super(); }

    async init(values?: InputWidgetAudioTermItemData): Promise<void> {
        if (!values?.data?.audioblob && values?.data?.audio) {
            const url = this.utils.resourceURL(values.data.audio);
            values.data.audioblob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.audio;
        }
        if (!values?.data?.captionsblob && values?.data?.captions) {
            const url = this.utils.resourceURL(values.data.captions);
            values.data.captionsblob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.captions;
        }
        await super.init(values);
        this.data = values?.data ? structuredClone(values?.data) : { term: "", definition: "", audioblob: "", captionsblob: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                term: this.data.term,
                definition: this.data.definition,
                audioblob: this.data.audioblob,
                captionsblob: this.data.captionsblob
            }));
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

        $iAudio.on('change', () => {
            const self = $iAudio[0] as HTMLInputElement;
            $iAudioBlob.val('');
            $iAudio.prop('required', true);
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    if (value) {
                        $iAudio.prop('required', false);
                        $iAudioBlob.val(value.toString());
                    }
                });
            }
        });

        $iCaptions.on('change', () => {
            const self = $iCaptions[0] as HTMLInputElement;
            $iCaptionsBlob.val('');
            $iCaptions.prop('required', true);
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
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
        if (!this.utils.isValidBase64DataUrl(this.data.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!this.utils.isValidBase64DataUrl(this.data.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidBase64DataUrl(form.captionsblob))
            errors.push("common.captionsblob.invalid");
        if (!this.utils.isValidBase64DataUrl(form.audioblob))
            errors.push("common.audioblob.invalid");
        return errors;
    }
}