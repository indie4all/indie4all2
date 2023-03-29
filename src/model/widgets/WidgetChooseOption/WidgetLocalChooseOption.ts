/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetChooseOptionData } from "../../../types";
import WidgetChooseOption from "./WidgetChooseOption";

export default class WidgetLocalChooseOption extends WidgetChooseOption {

    static async create(values?: InputWidgetChooseOptionData): Promise<WidgetLocalChooseOption> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = Utils.resourceURL(values.data.image);
            values.data.blob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        return new WidgetLocalChooseOption(values);
    }

    constructor(values?: InputWidgetChooseOptionData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Choose option-" + this.id,
            help: "",
        };
        this.data = values?.data ? structuredClone(values.data) : {
            text: "", blob: "", alt: "",
            options: [
                { text: "", correct: false }, { text: "", correct: false },
                { text: "", correct: false }, { text: "", correct: false }
            ]
        }
    }

    clone(): WidgetLocalChooseOption {
        const widget = new WidgetLocalChooseOption();
        widget.params = structuredClone(this.params);
        widget.params.name = "Choose option-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
        var data = {
            instanceId: this.id,
            text: this.data.text,
            blob: this.data.blob,
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

    settingsOpened(): void {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !this.data.blob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);

        $iImg.on('change', function () {
            const self = <HTMLInputElement>this;
            $sectionPreview.toggleClass('d-none', true);
            $iImg.prop('required', true);
            $iBlob.val('');
            if (self.files) {
                Utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(<string>value);
                    $preview.attr('src', <string>value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.blob = form.blob;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        return errors;
    }
}
