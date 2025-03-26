/* global $ */
import "./styles.scss";
import { InputWidgetChooseOptionData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import ChooseOptionElement from "./choose-option.element";

export default class ChooseOptionRemoteElement extends HasFilePickerElement(ChooseOptionElement) {

    constructor() { super(); }

    async init(values?: InputWidgetChooseOptionData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Choose option-" + this.id,
            help: "",
        };
        if (options.regenerateId) this.params.name = "Choose option-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : {
            text: "", blob: "", alt: "",
            options: [
                { text: "", correct: false }, { text: "", correct: false },
                { text: "", correct: false }, { text: "", correct: false }
            ]
        }
    }

    get form() {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                text: this.data.text,
                image: this.data.image,
                options: this.data.options,
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
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', (e) => {
            $form.find('.preview-error').toggleClass('d-none', true);
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
        if (!this.utils.isValidResource(this.data.image)) errors.push("ChooseOption.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!this.utils.isValidResource(form.image)) errors.push("ChooseOption.image.invalid");
        return errors;
    }
}
