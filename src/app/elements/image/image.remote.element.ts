/* global $ */
import "./styles.scss";
import { InputWidgetImageData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import ImageElement from "./image.element";

export default class ImageRemoteElement extends HasFilePickerElement(ImageElement) {

    constructor() { super(); }

    async init(values?: InputWidgetImageData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.image && values?.data?.blob) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: ImageRemoteElement.widget + "-" + this.id,
            help: "",
        };
        if (options.regenerateId) this.params.name = ImageRemoteElement.widget + "-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : { text: "", image: "", alt: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt,
                text: this.data.text,
                image: this.data.image
            }));
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
        $iImg.on('change', (e) => {
            $form.find('.preview-error').toggleClass('d-none', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (this.utils.isValidResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
        $preview.on('error', function () {
            const emptySrc = (this as HTMLImageElement).src === window.location.href;
            $form.find('.preview-error').toggleClass('d-none', emptySrc);
            $sectionPreview.toggleClass('d-none', true);
        });
        this.initFilePicker($iImg);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const keys = super.validateModel();
        if (!this.utils.isValidResource(this.data.image))
            keys.push("Image.image.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        const keys = super.validateForm(form);
        if (!this.utils.isValidResource(form.image))
            keys.push("Image.image.invalid");
        return keys;
    }
}