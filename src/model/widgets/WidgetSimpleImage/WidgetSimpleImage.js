/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetSimpleImage extends WidgetItemElement {

    config = {
        widget: "SimpleImage",
        type: "element",
        label: "Simple image",
        category: "simpleElements",
        toolbar: { edit: true},
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC80lEQVRoBe2ZS2gTURSG/0wTrWltUqjWgoy1XUgXiiAyIGrrRkVFK8iAL6yb4GOTbmTqyk1NdtVNhQFxU1GyUBdVLC5a0YURKoWCWdoG3Ck1VgLSJCNn7MQ0uTedvO4EyQ8DM/cx58vJufee5LiQI1lR9wIYhLNaAPAiHo384FFkoWVFHQMQ3N61BXQ5pQ+fPmMV/Gw8GpnjYsiKekdWVGPq7UfDaSWWfxnHL98yZEVdkhXVXwx66eHTl44DWyLwA4M3CTzI4pVkRR0A4D93st/hUP6nttYWHO3fT89nWP2SdUMD60m+IjxSXZHaVAO62tq4wePXQvqAFtLX7CJFoY34N6RDz7MXPYuUv62VDrtpAF+0kD5kmXZzgecXsXLiLpBIZtvS46/heRKE62CfaKeTpx9pIX0hPBKY4Xo6df7eGmBTiSRS13QBjFxdAS88yMu8UKB2433MAV5T3fivdg/X7h2Az8ue4fNWHNOVflNcT7sfBNjt4UsVGUxd180Fnnn8rux3cHcP6dQ+eF7dRnp86u+C9HnRdONYRV4mYAuW7sm4dPFQ9aBJBOiu0vaWC5zbVg64kIXIArbTx1PNoe1AlQpeU+hSYEoZWzPocr52u3OKJ0zzi0hdYBznVTJe7lwuNB3X5n46OVuQOFVq1NY7Jme5/WxoSoxyEiZWxlcrYEtkk6dC6ETSBMyftB54NYHXUwF0SpvgfkoeuEhg5EPbMZ4PLhoYucc45Rh2jVvgrj2ycGCsgdYmSppo/lAoslhqqcZfCKLUgBalBrQoNaBFSVotyiDaYtQV2JvNGbR4NzH7pHg0QtAzo50p/GwSzsbUM38GsWYDPXIXs986xodjzcb06Z4V/9B3CX2/nYmaZckwPUzQu3plbO1oZ44zoaleJyvqzq8eY2x0W3oASHeLBrbU2dGOw71y0VpmNmFarZBeZQ3SQnpdBbzdOOBXTsVqrhTo4ToApki4D7vQVDKgWrW1PTogsn8kPBJwyn6FAvAHxnVfJg4KZGkAAAAASUVORK5CYII=",
        cssClass: "widget-simple-image"
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                aspect: "original",
				align: "left",
            },
            data: { blob: "", alt: "", width: 0, height: 0 }
        }
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            blob: model.data.blob,
            alt: model.data.alt,
            aspect: model.params.aspect,
            align: model.params.align,
            width: model.data.width,
            height: model.data.height
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.SimpleImage.label")
        };
    }

    preview(model) {
        return model.params?.name ?? this.translate("widgets.SimpleImage.prev");
    }

    settingsOpened(model) {
        let ratio = 1;
        let imgChanged = false;
        let $form = $('#f-' + model.id);
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
        $iImg.prop('required', !model.data.blob);
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

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.aspect = form.aspect;
		model.params.align = form.align;
        model.data.alt = form.alt;
		model.data.width = form.width;
        model.data.height = form.height;
        model.data.blob = form.blob;
    }

    validateModel(widget) {
        var keys = [];
        if (!Utils.isValidBase64DataUrl(widget.data.blob))
            keys.push("common.imageblob.invalid");
        if (!Utils.hasNameInParams(widget)) keys.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt)) keys.push("common.alt.invalid")
		if ( widget.params.aspect === 'custom' && (!widget.data.width || !widget.data.height))
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