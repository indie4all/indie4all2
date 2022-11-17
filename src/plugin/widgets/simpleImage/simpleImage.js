indieauthor.widgets.SimpleImage = {
    widgetConfig: {
        widget: "SimpleImage",
        type: "element",
        label: "Simple image",
        category: "simpleElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function () {
        var item = {};
        item.content = indieauthor.renderTemplate('<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="' + this.icon + '" class="img-fluid"/> <br/> <span>{{translate "widgets.SimpleImage.label"}}</span> </div>', this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function (options) {
        return '<div class="widget widget-simple-image" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"> \ <div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/> </div>\ <div class="b2" data-prev><span>{{translate "widgets.SimpleImage.prev"}}</span></div>\ <div class="b3" data-toolbar> </div>\ </div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            instanceName: modelObject.params.name,
            image: modelObject.data.image,
            blob: modelObject.data.blob,
            alt: modelObject.data.alt,
            aspect: modelObject.params.aspect,
            align: modelObject.params.align,
            width: modelObject.data.width,
            height: modelObject.data.height
        }

        var inputTemplate = `
            <form id="f-{{instanceId}}">
                <div class="form-group">
                    <label for="instanceName">{{translate "common.name.label"}}</label>
                    <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/>
                    <small class="form-text text-muted">{{translate "common.name.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="image">{{translate "widgets.SimpleImage.form.image.label"}}</label>
                    <input type="url" class="form-control" name="image" required placeholder="{{translate "widgets.SimpleImage.form.image.placeholder"}}" value="{{image}}" autocomplete="off"/>
                    <small class="form-text text-muted">{{translate "widgets.SimpleImage.form.image.help"}}</small>
                    <input type="hidden" name="blob" value="{{blob}}">
                </div>
                <div class="form-group">
                    <label for="alt">{{translate "common.alt.label"}}</label>
                    <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
                    <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
                </div>
                <div class="form-group">
                    <label for="simple-image-aspect">{{translate "widgets.SimpleImage.form.aspect.label"}}</label>
                    <select id="simple-image-aspect" name="aspect" class="form-control" required>
                        <option value="original" {{#ifeq aspect "original"}} selected {{/ifeq}}>{{translate "widgets.SimpleImage.form.aspect.values.original"}}</option>
                        <option value="fit" {{#ifeq aspect "fit"}} selected {{/ifeq}}>{{translate "widgets.SimpleImage.form.aspect.values.fit"}}</option>
						<option value="custom" {{#ifeq aspect "custom"}} selected {{/ifeq}}>{{translate "widgets.SimpleImage.form.aspect.values.custom"}}</option>
                    </select>
                    <small class="form-text text-muted">{{translate "widgets.SimpleImage.form.aspect.help"}}</small>
                </div>
				<div class="form-row size">
                    <div class="form-group col-6">
                        <label for="simple-image-width">{{translate "widgets.SimpleImage.form.size.width"}}</label>
                        <input type="number" min="1" class="form-control" id="simple-image-width" name="width" value="{{width}}" placeholder="{{translate "widgets.SimpleImage.form.size.widthPlaceholder" }}" />
                    </div>
                    <div class="form-group col-6">
                        <label for="simple-image-height">{{translate "widgets.SimpleImage.form.size.height"}}</label>
                        <input type="number" min="1" class="form-control" id="simple-image-height" name="height" value="{{height}}" placeholder="{{translate "widgets.SimpleImage.form.size.heightPlaceholder"}} " />
                    </div>
                    <div class="form-group col-12">
                        <div class="form-check">
                        <input name="keep-ratio" class="form-check-input" type="checkbox" id="simple-image-keep-ratio">
                        <label class="form-check-label" for="simple-image-keep-ratio">
                            {{translate "widgets.SimpleImage.form.size.keepRatio"}}
                        </label>
                        </div>
                    </div>
                </div>
				<div class="form-group">
                    <label for="simple-image-align">{{translate "widgets.SimpleImage.form.align.label"}}</label>
                    <select id="simple-image-align" name="align" class="form-control" required>
                        <option value="left" {{#ifeq align "left"}} selected {{/ifeq}}>{{translate "widgets.SimpleImage.form.align.values.left"}}</option>
                        <option value="right" {{#ifeq align "right"}} selected {{/ifeq}}>{{translate "widgets.SimpleImage.form.align.values.right"}}</option>
                        <option value="center" {{#ifeq align "center"}} selected {{/ifeq}}>{{translate "widgets.SimpleImage.form.align.values.center"}}</option>
                    </select>
                    <small class="form-text text-muted">{{translate "widgets.SimpleImage.form.align.help"}}</small>
                </div>
                <div class="form-group image-preview">
                    <p>{{translate "widgets.SimpleImage.form.preview"}}</p>
                    <img class="img-fluid" src="{{image}}"/>
                </div>
            </form>`;
        var rendered = indieauthor.renderTemplate(inputTemplate, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.SimpleImage.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        let ratio = 1;
        let imgUrlChanged = false;
        let $form = $('#f-' + modelObject.id);
        let $preview = $form.find('.image-preview');
        let $size = $form.find('.size');
        let $img = $preview.find('img');
        let $keepRatio = $form.find('[name=keep-ratio]');
        let $imgHeight = $form.find('[name=height]');
        let $imgWidth = $form.find('[name=width]');
        // Show size if ratio is equals to "Custom"
        let $aspect = $form.find('[name=aspect]');
        $size.toggle($aspect.val() === 'custom');
        $img.width($aspect.val() === 'custom' ? $imgWidth.val() : '');
        $img.height($aspect.val() === 'custom' ? $imgHeight.val() : '');
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
            if (imgUrlChanged) {
                imgUrlChanged = false;
                $(this).width('');
                $(this).height('');
                $imgHeight.val(this.naturalHeight);
                $imgWidth.val(this.naturalWidth);
            }
        });
        $form.find('input[name="image"]').on('change', function (e) {
            imgUrlChanged = true;
            $preview.hide();
            imgLoaded = false;
            $img.attr('src', e.target.value);
            $('input[name="blob"]').val('');
            indieauthor.utils.encodeAsBase64DataURL(e.target.value).then(value => 
                $('input[name="blob"]').val(value));
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        if (modelObject.params.name && modelObject.data.image)
            element.innerHTML = modelObject.params.name + ": " + modelObject.data.image;
        else
            element.innerHTML = indieauthor.strings.widgets.SimpleImage.prev;
    },
    emptyData: function (options) {
        var object = {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
                aspect: "original",
				align: "left",
            },
            data: {
                image: "",
                blob: "",
                alt: "",
                width: 0,
                height: 0
            }
        };

        return object;
    },
    updateModelFromForm: async function (modelObject, formJson) {
        modelObject.data.image = formJson.image;
        modelObject.data.blob = formJson.blob;
        modelObject.params.name = formJson.instanceName;
        modelObject.params.aspect = formJson.aspect;
		modelObject.params.align = formJson.align;
        modelObject.data.alt = formJson.alt;
		modelObject.data.width = formJson.width;
        modelObject.data.height = formJson.height;
        modelObject.data.blob = formJson.blob;
    },
    validateModel: function (widgetInstance) {
        var keys = [];

        if (!indieauthor.utils.isIndieResource(widgetInstance.data.image))
            keys.push("SimpleImage.image.invalid");

        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            keys.push("common.name.notUniqueName");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.alt))
            keys.push("common.alt.invalid")
		
		if ( widgetInstance.params.aspect === 'custom' && (!widgetInstance.data.width || !widgetInstance.data.height))
            keys.push("SimpleImage.image.sizeNotSet");

        if (keys.length > 0) {
            return {
                element: widgetInstance.id,
                keys: keys
            }
        }

        return undefined;
    },
    validateForm: function (formData, instanceId) {
        var keys = [];

        if (!indieauthor.utils.isIndieResource(formData.image))
            keys.push("SimpleImage.image.invalid");

        if (formData.instanceName.length == 0)
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(formData.instanceName, instanceId))
            keys.push("common.name.notUniqueName");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            keys.push("common.alt.invalid")
		
		if ( formData.aspect === 'custom' && (!formData.width || !formData.height))
            keys.push("SimpleImage.image.sizeNotSet");

        return keys;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC80lEQVRoBe2ZS2gTURSG/0wTrWltUqjWgoy1XUgXiiAyIGrrRkVFK8iAL6yb4GOTbmTqyk1NdtVNhQFxU1GyUBdVLC5a0YURKoWCWdoG3Ck1VgLSJCNn7MQ0uTedvO4EyQ8DM/cx58vJufee5LiQI1lR9wIYhLNaAPAiHo384FFkoWVFHQMQ3N61BXQ5pQ+fPmMV/Gw8GpnjYsiKekdWVGPq7UfDaSWWfxnHL98yZEVdkhXVXwx66eHTl44DWyLwA4M3CTzI4pVkRR0A4D93st/hUP6nttYWHO3fT89nWP2SdUMD60m+IjxSXZHaVAO62tq4wePXQvqAFtLX7CJFoY34N6RDz7MXPYuUv62VDrtpAF+0kD5kmXZzgecXsXLiLpBIZtvS46/heRKE62CfaKeTpx9pIX0hPBKY4Xo6df7eGmBTiSRS13QBjFxdAS88yMu8UKB2433MAV5T3fivdg/X7h2Az8ue4fNWHNOVflNcT7sfBNjt4UsVGUxd180Fnnn8rux3cHcP6dQ+eF7dRnp86u+C9HnRdONYRV4mYAuW7sm4dPFQ9aBJBOiu0vaWC5zbVg64kIXIArbTx1PNoe1AlQpeU+hSYEoZWzPocr52u3OKJ0zzi0hdYBznVTJe7lwuNB3X5n46OVuQOFVq1NY7Jme5/WxoSoxyEiZWxlcrYEtkk6dC6ETSBMyftB54NYHXUwF0SpvgfkoeuEhg5EPbMZ4PLhoYucc45Rh2jVvgrj2ycGCsgdYmSppo/lAoslhqqcZfCKLUgBalBrQoNaBFSVotyiDaYtQV2JvNGbR4NzH7pHg0QtAzo50p/GwSzsbUM38GsWYDPXIXs986xodjzcb06Z4V/9B3CX2/nYmaZckwPUzQu3plbO1oZ44zoaleJyvqzq8eY2x0W3oASHeLBrbU2dGOw71y0VpmNmFarZBeZQ3SQnpdBbzdOOBXTsVqrhTo4ToApki4D7vQVDKgWrW1PTogsn8kPBJwyn6FAvAHxnVfJg4KZGkAAAAASUVORK5CYII=",
}