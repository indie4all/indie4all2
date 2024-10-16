/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetChooseOptionData } from "../../../types";
import WidgetChooseOption from "./WidgetChooseOption";
import HasFilePickerElement from "../mixings/HasFilePickerElement";

export default class WidgetRemoteChooseOption extends HasFilePickerElement(WidgetChooseOption) {

    static async create(values?: InputWidgetChooseOptionData): Promise<WidgetRemoteChooseOption> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        return new WidgetRemoteChooseOption(values);
    }

    constructor(values?: InputWidgetChooseOptionData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Choose option-" + this.id,
            help: "",
        };
        this.data = values?.data ? structuredClone(values.data) : {
            text: "", image: "", alt: "",
            options: [
                { text: "", correct: false }, { text: "", correct: false },
                { text: "", correct: false }, { text: "", correct: false }
            ]
        }
    }

    clone(): WidgetRemoteChooseOption {
        const widget = new WidgetRemoteChooseOption();
        widget.params = structuredClone(this.params);
        widget.params.name = "Choose option-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        var data = {
            instanceId: this.id,
            text: this.data.text,
            image: this.data.image,
            options: this.data.options,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.ChooseOption.label")
        };
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', function (e) {
            $form.find('.preview-error').toggleClass('d-none', true);
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (Utils.isValidResource(value)) {
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
        if (!Utils.isValidResource(this.data.image)) errors.push("ChooseOption.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidResource(form.image)) errors.push("ChooseOption.image.invalid");
        return errors;
    }
}
