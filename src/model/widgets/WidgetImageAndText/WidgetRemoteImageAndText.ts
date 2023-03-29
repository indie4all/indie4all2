/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import icon from "./icon.png";
import { FormEditData, InputWidgetImageAndTextData, WidgetImageAndTextData, WidgetImageAndTextParams } from "../../../types";
import WidgetImageAndText from "./WidgetImageAndText";

export default class WidgetRemoteImageAndText extends WidgetImageAndText {

    static widget = "ImageAndText";
    static category = "interactiveElements";
    static icon = icon;

    params: WidgetImageAndTextParams;
    data: WidgetImageAndTextData;

    static async create(values?: InputWidgetImageAndTextData): Promise<WidgetRemoteImageAndText> {
        // TODO Local to remote resources
        if (values?.data?.blob && !values?.data?.image)
            throw new Error("Conversion from Local to Remote is not currently supported");
        return new WidgetRemoteImageAndText(values);
    }

    constructor(values?: InputWidgetImageAndTextData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Image and Text-" + this.id,
            help: ""
        };
        this.data = values?.data ? structuredClone(values.data) : { text: "", image: "", layout: 0, alt: "" };
    }

    clone(): WidgetRemoteImageAndText {
        const widget = new WidgetRemoteImageAndText();
        widget.params = structuredClone(this.params);
        widget.params.name = "Image and Text-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        const data = {
            instanceId: this.id,
            image: this.data.image,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.ImageAndText.label")
        };
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        const editorElement = $form.find('.texteditor');
        this.initTextEditor(this.data.text, editorElement);
        $sectionPreview.toggleClass('d-none', !this.data.image);
        $iImg.on('change', function (e) {
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            const value = (e.target as HTMLInputElement).value;
            if (Utils.isIndieResource(value)) {
                $preview.attr('src', value);
                $sectionPreview.toggleClass('d-none', false);
            }
        });
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isIndieResource(this.data.image)) errors.push("ImageAndText.image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        if (!Utils.isIndieResource(form.image)) errors.push("ImageAndText.image.invalid");
        return errors;
    }
}
