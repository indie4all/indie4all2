/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { ChooseOption, FormEditData } from "../../../types";

export default class WidgetChooseOption extends WidgetItemElement {

    static widget = "ChooseOption";
    static category = "interactiveElements";
    static icon = icon;

    private static optionsNumber: number = 4;
    private static optionsWithoutCorrect(options) {
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.correct)
                return false;
        }
        return true;
    }

    params: { name: string, help: string };
    data: {
        text: string, blob: string, alt: string,
        options: ChooseOption[]
    }

    constructor(values?: any) {
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

    clone(): WidgetChooseOption {
        const widget = new WidgetChooseOption();
        widget.params = structuredClone(this.params);
        widget.params.name = "Choose option-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
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

    preview(): string {
        return this.params?.name && this.data?.text ?
            this.params.name + " | " + this.data.text : this.translate("widgets.ChooseOption.prev");
    }

    updateModelFromForm(form: any): void {
        var options: ChooseOption[] = [];
        for (var i = 0; i < WidgetChooseOption.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({ text: option, correct: parseInt(form.correct) == i })
            }
        }

        this.data.options = options;
        this.data.blob = form.blob;
        this.data.text = form.text;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (WidgetChooseOption.optionsWithoutCorrect(this.data.options))
            errors.push("ChooseOption.options.noCorrect");
        if (this.data.options.length != WidgetChooseOption.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (!Utils.hasNameInParams(this))
            errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        var options: ChooseOption[] = [];

        for (var i = 0; i < WidgetChooseOption.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({ text: option, correct: parseInt(form.correct) == i })
            }
        }

        if (form.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (WidgetChooseOption.optionsWithoutCorrect(options))
            errors.push("ChooseOption.options.noCorrect");
        if (options.length != WidgetChooseOption.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
