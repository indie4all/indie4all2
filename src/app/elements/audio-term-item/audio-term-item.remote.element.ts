/* global $ */
import './styles.scss';
import { InputWidgetAudioTermItemData } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import AudioTermItemElement from "./audio-term-item.element";
import { FilePickerType } from '../../services/file-picker/types';

export default class AudioTermItemRemoteElement extends HasFilePickerElement(AudioTermItemElement) {

    constructor() { super(); }

    async init(values?: InputWidgetAudioTermItemData): Promise<void> {
        if (!values?.data?.captions && values?.data?.captionsblob) {
            const url = await this.utils.base64DataURLToURL(values.data.captionsblob);
            values.data.captions = url;
            delete values.data.captionsblob;
            //throw new Error("Conversion from Local to Remote is not currently supported");
        }
        if (!values?.data?.audio && values?.data?.audioblob) {
            const url = await this.utils.base64DataURLToURL(values.data.audioblob);
            values.data.audio = url;
            delete values.data.audioblob;
            //throw new Error("Conversion from Local to Remote is not currently supported");
        }
        await super.init(values);
        this.data = values?.data ? structuredClone(values.data) : { term: "", definition: "", audio: "", captions: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                term: this.data.term,
                definition: this.data.definition,
                audio: this.data.audio,
                captions: this.data.captions
            }));
    }

    settingsOpened(): void {
        const $form = $('#f-' + this.id);
        this.initFilePicker($form.find('input[name="audio"]'), FilePickerType.AUDIO);
        this.initFilePicker($form.find('input[name="captions"]'), FilePickerType.SUBTITLES);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.audio = form.audio;
        this.data.captions = form.captions;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isStringEmptyOrWhitespace(this.data.captions) &&
            !this.utils.isValidResource(this.data.captions))
            errors.push("common.captions.invalid");
        if (!this.utils.isValidResource(this.data.audio))
            errors.push("AudioTermItem.audio.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors: string[] = super.validateForm(form);
        if (!this.utils.isStringEmptyOrWhitespace(form.captions) &&
            !this.utils.isValidResource(form.captions))
            errors.push("common.captions.invalid");
        if (!this.utils.isValidResource(form.audio))
            errors.push("AudioTermItem.audio.invalid");
        return errors;
    }
}
