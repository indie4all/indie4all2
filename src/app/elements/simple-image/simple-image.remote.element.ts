/* global $ */
import "./styles.scss";
import { InputWidgetSimpleImageData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import SimpleImageElement from "./simple-image.element";
import { FilePickerType } from "../../services/file-picker/types";

export default class SimpleImageRemoteElement extends HasFilePickerElement(SimpleImageElement) {

    constructor() { super(); }

    async init(values?: InputWidgetSimpleImageData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (values?.data?.blob && !values?.data?.image) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Simple image-" + this.id,
            aspect: "original",
            align: "left",
        };
        if (options.regenerateId) this.params.name = "Simple image-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : { image: "", alt: "", width: 0, height: 0 };
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            image: this.data.image,
            alt: this.data.alt,
            aspect: this.params.aspect,
            align: this.params.align,
            width: this.data.width,
            height: this.data.height
        }));
    }

    settingsOpened(): void {
        let $form = $('#f-' + this.id);
        let ratio = 1;
        let imgChanged = false;
        let $preview = $form.find('.image-preview');
        let $size = $form.find('.size');
        let $img = $preview.find('img');
        let $keepRatio = $form.find('[name=keep-ratio]');
        let $imgHeight = $form.find('[name=height]');
        let $imgWidth = $form.find('[name=width]');
        // Show size if ratio is equals to "Custom"
        let $aspect = $form.find('[name=aspect]');
        const $iImg = $('input[name=image]');
        $size.toggle($aspect.val() === 'custom');
        $img.width($aspect.val() === 'custom' ? $imgWidth.val() as string : '');
        $img.height($aspect.val() === 'custom' ? $imgHeight.val() as string : '');
        $aspect.on('change', function () {
            let aspect = $(this).val();
            $size.toggle(aspect === 'custom');
            $img.width(aspect === 'custom' ? $imgWidth.val() as string : '');
            $img.height(aspect === 'custom' ? $imgHeight.val() as string : '');
        });
        // Enable disable setting image height
        $keepRatio.on('change', function () {
            let checked = $keepRatio.prop('checked');
            // If checked, set height to a proportional value
            $imgHeight.prop('disabled', checked);
            if (checked) {
                let width = $imgWidth.val() as string;
                if (width) {
                    let height = Math.round(parseInt(width) / ratio);
                    $imgHeight.val(height);
                    $img.height(height);
                }
            }
        });
        $imgHeight.on('change', function () {
            $img.height($(this).val() as string);
        });
        $imgWidth.on('change', function () {
            $img.width($(this).val() as string);
            if ($keepRatio.prop('checked')) {
                let height = Math.round(parseInt($(this).val() as string) / ratio);
                $imgHeight.val(height);
                $img.height(height);
            }
        });
        // Show image preview when loaded and set its size
        $preview.hide();
        $img.on('error', function () {
            const emptySrc = (this as HTMLImageElement).src === window.location.href;
            $form.find('.preview-error').toggleClass('d-none', emptySrc);
        });

        $img.on('load', function () {
            $form.find('.preview-error').addClass('d-none');
            $preview.show();
            ratio = this.naturalWidth / this.naturalHeight;
            // Set width and height only when the user changes the image
            if (imgChanged) {
                imgChanged = false;
                $(this).width('');
                $(this).height('');
                $imgHeight.val(this.naturalHeight);
                $imgWidth.val(this.naturalWidth);
            }
        });
        $iImg.on('change', (e) => {
            imgChanged = true;
            $preview.hide();
            $img.attr('src', '');
            const value = (e.target as HTMLInputElement).value;
            if (this.utils.isValidResource(value)) {
                $img.attr('src', value);
            }
        });

        this.initFilePicker($iImg, FilePickerType.IMAGE);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const keys = super.validateModel();
        if (!this.utils.isValidResource(this.data.image))
            keys.push("SimpleImage.image.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        const keys = super.validateForm(form);
        if (!this.utils.isValidResource(form.image)) keys.push("SimpleImage.image.invalid");
        return keys;
    }
}