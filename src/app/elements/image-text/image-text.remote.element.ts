/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetImageAndTextData, WidgetImageAndTextData, WidgetImageAndTextParams } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import ImageTextElement from "./image-text.element";

export default class ImageTextRemoteElement extends HasFilePickerElement(ImageTextElement) {

    static widget = "ImageAndText";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageAndTextParams;
    data: WidgetImageAndTextData;

    constructor() { super(); }

    async init(values?: InputWidgetImageAndTextData): Promise<void> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Text-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", image: "", layout: 0, alt: "" };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                image: this.data.image,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt
            }));
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.img-preview-wrapper');
        this.initTextEditor(this.data.text, '#f-' + this.id + ' .texteditor');
        $sectionPreview.toggleClass('d-none', !this.data.image);
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
        const errors = super.validateModel();
        if (!this.utils.isValidResource(this.data.image)) errors.push("ImageAndText.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidResource(form.image)) errors.push("ImageAndText.image.invalid");
        return errors;
    }
}
