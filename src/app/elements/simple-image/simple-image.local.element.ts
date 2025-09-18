/* global $ */
import "./styles.scss";
import { InputWidgetSimpleImageData, WidgetInitOptions } from "../../../types";
import SimpleImageElement from "./simple-image.element";

export default class SimpleImageLocalElement extends SimpleImageElement {

    constructor() { super(); }

    async init(values?: InputWidgetSimpleImageData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = this.utils.resourceURL(values.data.image);
            values.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Simple image-" + this.id,
            aspect: "original",
            align: "left",
        };
        if (options.regenerateId) this.params.name = "Simple image-" + this.id;
        this.data = values?.data ? structuredClone(values.data) : { blob: "", alt: "", width: 0, height: 0 };
    }

    get form(): Promise<string> {
        return import('./form-local.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            blob: this.data.blob,
            alt: this.data.alt,
            aspect: this.params.aspect,
            align: this.params.align,
            width: this.data.width,
            height: this.data.height
        }));
    }

    settingsOpened(): void {
        let ratio = 1;
        let imgChanged = false;
        let $form = $('#f-' + this.id);
        let $preview = $form.find('.image-preview');
        let $size = $form.find('.size');
        let $img = $preview.find('img');
        let $keepRatio = $form.find('[name=keep-ratio]');
        let $imgHeight = $form.find('[name=height]');
        let $imgWidth = $form.find('[name=width]');
        // Show size if ratio is equals to "Custom"
        let $aspect = $form.find('[name=aspect]');
        const $iImg = $('input[name=image]');
        const $iBlob = $('input[name=blob]');
        $size.toggle($aspect.val() === 'custom');
        $img.width($aspect.val() === 'custom' ? <string>$imgWidth.val() : '');
        $img.height($aspect.val() === 'custom' ? <string>$imgHeight.val() : '');
        $iImg.prop('required', !this.data.blob);
        $aspect.on('change', function () {
            let aspect = $(this).val();
            $size.toggle(aspect === 'custom');
            $img.width(aspect === 'custom' ? <string>$imgWidth.val() : '');
            $img.height(aspect === 'custom' ? <string>$imgHeight.val() : '');
        });
        // Enable disable setting image height
        $keepRatio.on('change', function () {
            let checked = $keepRatio.prop('checked');
            // If checked, set height to a proportional value
            $imgHeight.prop('disabled', checked);
            if (checked) {
                let width = <string>$imgWidth.val();
                if (width) {
                    let height = Math.round(parseInt(width) / ratio);
                    $imgHeight.val(height);
                    $img.height(height);
                }
            }
        });
        $imgHeight.on('change', function () {
            $img.height(<string>$(this).val());
        });
        $imgWidth.on('change', function () {
            $img.width(<string>$(this).val());
            if ($keepRatio.prop('checked')) {
                let height = Math.round(<number>$(this).val() / ratio);
                $imgHeight.val(height);
                $img.height(height);
            }
        });
        // Show image preview when loaded and set its size
        $preview.hide();
        $img.on('load', function () {
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
        $iImg.on('change', () => {
            const self = $iImg[0] as HTMLInputElement;
            imgChanged = true;
            $preview.hide();
            $img.attr('src', '');
            $iImg.prop('required', true);
            $iBlob.val('');
            if (self.files) {
                this.utils.encodeBlobAsBase64DataURL(self.files[0]).then(value => {
                    $img.attr('src', <string>value);
                    $iImg.prop('required', false);
                    $iBlob.val(<string>value);
                });
            }
        });
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.blob = form.blob;
    }

    validateModel(): string[] {
        const keys = super.validateModel();
        if (!this.utils.isValidBase64DataUrl(this.data.blob))
            keys.push("common.imageblob.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        const keys = super.validateForm(form);
        if (!this.utils.isValidBase64DataUrl(form.blob)) keys.push("common.imageblob.invalid");
        return keys;
    }
}