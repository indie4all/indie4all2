/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetSimpleImage extends WidgetItemElement {

    static widget = "SimpleImage";
    static type = "element";
    static label = "Simple image";
    static category = "simpleElements";
    static toolbar = { edit: true};
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC80lEQVRoBe2ZS2gTURSG/0wTrWltUqjWgoy1XUgXiiAyIGrrRkVFK8iAL6yb4GOTbmTqyk1NdtVNhQFxU1GyUBdVLC5a0YURKoWCWdoG3Ck1VgLSJCNn7MQ0uTedvO4EyQ8DM/cx58vJufee5LiQI1lR9wIYhLNaAPAiHo384FFkoWVFHQMQ3N61BXQ5pQ+fPmMV/Gw8GpnjYsiKekdWVGPq7UfDaSWWfxnHL98yZEVdkhXVXwx66eHTl44DWyLwA4M3CTzI4pVkRR0A4D93st/hUP6nttYWHO3fT89nWP2SdUMD60m+IjxSXZHaVAO62tq4wePXQvqAFtLX7CJFoY34N6RDz7MXPYuUv62VDrtpAF+0kD5kmXZzgecXsXLiLpBIZtvS46/heRKE62CfaKeTpx9pIX0hPBKY4Xo6df7eGmBTiSRS13QBjFxdAS88yMu8UKB2433MAV5T3fivdg/X7h2Az8ue4fNWHNOVflNcT7sfBNjt4UsVGUxd180Fnnn8rux3cHcP6dQ+eF7dRnp86u+C9HnRdONYRV4mYAuW7sm4dPFQ9aBJBOiu0vaWC5zbVg64kIXIArbTx1PNoe1AlQpeU+hSYEoZWzPocr52u3OKJ0zzi0hdYBznVTJe7lwuNB3X5n46OVuQOFVq1NY7Jme5/WxoSoxyEiZWxlcrYEtkk6dC6ETSBMyftB54NYHXUwF0SpvgfkoeuEhg5EPbMZ4PLhoYucc45Rh2jVvgrj2ycGCsgdYmSppo/lAoslhqqcZfCKLUgBalBrQoNaBFSVotyiDaYtQV2JvNGbR4NzH7pHg0QtAzo50p/GwSzsbUM38GsWYDPXIXs986xodjzcb06Z4V/9B3CX2/nYmaZckwPUzQu3plbO1oZ44zoaleJyvqzq8eY2x0W3oASHeLBrbU2dGOw71y0VpmNmFarZBeZQ3SQnpdBbzdOOBXTsVqrhTo4ToApki4D7vQVDKgWrW1PTogsn8kPBJwyn6FAvAHxnVfJg4KZGkAAAAASUVORK5CYII=";
    static cssClass = "widget-simple-image";

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: WidgetSimpleImage.label + "-" + Utils.generate_uuid(),
            aspect: "original",
            align: "left",
        };
        this.data = values?.data ?? { blob: "", alt: "", width: 0, height: 0 };
    }

    clone() {
        return new WidgetSimpleImage(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                instanceName: this.params.name,
                blob: this.data.blob,
                alt: this.data.alt,
                aspect: this.params.aspect,
                align: this.params.align,
                width: this.data.width,
                height: this.data.height
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.SimpleImage.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.SimpleImage.prev");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetSimpleImage.label + "-" + Utils.generate_uuid();
    }

    settingsOpened() {
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
        $img.width($aspect.val() === 'custom' ? $imgWidth.val() : '');
        $img.height($aspect.val() === 'custom' ? $imgHeight.val() : '');       
        $iImg.prop('required', !this.data.blob);
        $aspect.on('change', function () {
            let aspect = $(this).val();
            $size.toggle(aspect === 'custom');
            $img.width(aspect === 'custom' ? $imgWidth.val() : '');
            $img.height(aspect === 'custom' ? $imgHeight.val() : '');
        });
        // Enable disable setting image height
        $keepRatio.on('change', function () {
            let checked = $keepRatio.prop('checked');
            // If checked, set height to a proportional value
            $imgHeight.prop('disabled', checked);
            if (checked) {
                let width = $imgWidth.val();
                if (width) {
                    let height = Math.round(parseInt(width) / ratio);
                    $imgHeight.val(height);
                    $img.height(height);
                }
            }
        });
        $imgHeight.on('change', function () {
            $img.height($(this).val()); 
        });
        $imgWidth.on('change', function () {
            $img.width($(this).val());
            if ($keepRatio.prop('checked')) {
                let height = Math.round(parseInt($(this).val() / ratio));
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
        $iImg.on('change', function () {
            imgChanged = true;
            $preview.hide();
            $img.attr('src', '');
            $iImg.prop('required', true);
            $iBlob.val('');
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $img.attr('src', value);
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                });
            }
        });
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.aspect = form.aspect;
		this.params.align = form.align;
        this.data.alt = form.alt;
		this.data.width = form.width;
        this.data.height = form.height;
        this.data.blob = form.blob;
    }

    validateModel() {
        var keys = [];
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            keys.push("common.imageblob.invalid");
        if (!Utils.hasNameInParams(this)) keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt)) keys.push("common.alt.invalid")
		if ( this.params.aspect === 'custom' && (!this.data.width || !this.data.height))
            keys.push("SimpleImage.image.sizeNotSet");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (!Utils.isValidBase64DataUrl(form.blob)) keys.push("common.imageblob.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) keys.push("common.alt.invalid")
		if ( form.aspect === 'custom' && (!form.width || !form.height))
            keys.push("SimpleImage.image.sizeNotSet");
        return keys;
    }
}