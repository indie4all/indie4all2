indieauthor.widgets.Image = {
    widgetConfig: {
        widget: "Image",
        type: "element",
        label: "Image",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function () {
        var item = {};
        item.content = indieauthor.renderTemplate('<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="' + this.icon + '" class="img-fluid"/> <br/> <span>{{translate "widgets.Image.label"}}</span> </div>', this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        var element = indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
        return element;
    },
    template: function () {
        return '<div class="widget widget-image" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"> \ <div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/> </div>\ <div class="b2" data-prev><span>{{translate "widgets.Image.prev"}}</span></div>\ <div class="b3" data-toolbar> </div>\ </div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            instanceName: modelValues.params.name,
            help: modelValues.params.help,
            alt: modelValues.data.alt
        }

        if (!indieauthor.utils.isEmpty(modelValues.data)) {
            templateValues.text = modelValues.data.text;
            templateValues.blob = modelValues.data.blob;
        }

        var inputTemplate = `
        <form id="f-{{instanceId}}">
            <div class="form-group">
                <label for="instanceName">{{translate "common.name.label"}}</label>
                <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/>
                <small class="form-text text-muted">{{translate "common.name.help"}}</small>
            </div>
            <div class="form-group">
                <label for="help">{{translate "common.help.label"}}</label>
                <div class="input-group mb-3">
                    <input name="help" type="text" class="form-control" placeholder="{{translate "common.help.placeholder"}}" value="{{help}}"> 
                    <div class="input-group-append">
                        <button class="btn btn-indie" type="button" onclick="$(\'input[name=help]\').val(\'\')">{{translate "common.help.button"}}</button>
                    </div>
                </div>
                <small class="form-text text-muted">{{translate "common.help.help"}}</small>
            </div>
            <div class="form-group">
                <label for="image">{{translate "widgets.Image.form.image.label"}}</label>
                <input type="file" class="form-control" name="image" accept="image/png, image/jpeg" />
                <small class="form-text text-muted">{{translate "widgets.Image.form.image.help"}}</small>
                <input type="hidden" name="blob" value="{{blob}}" />
            </div>
            <div class="form-group">
                <label for="alt">{{translate "common.alt.label"}}</label>
                <input type="text" class="form-control" name="alt" required autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
                <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
            </div> 
            <div class="form-group d-none">
                <p>{{translate "widgets.Image.form.preview"}}</p>
                <img class="img-fluid img-preview" src="{{blob}}"/>
            </div>
            <div class="form-group">
                <label for="text">{{translate "widgets.Image.form.caption.label"}}</label>
                <textarea class="form-control texteditor" name="text">{{text}}</textarea>
                <small class="form-text text-muted">{{translate "widgets.Image.form.caption.help"}}</small>
            </div>
        </form>`;
        var rendered = indieauthor.renderTemplate(inputTemplate, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.Image.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) {
        const $form = $('#f-' + modelObject.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !modelObject.data.blob);
        $sectionPreview.toggleClass('d-none', !modelObject.data.blob);

        var editorElement = $form.find('.texteditor');
        indieauthor.widgetFunctions.initTextEditor(modelObject.data.text, editorElement);

        $iImg.on('change', function (e) {
            $iBlob.val('');
            $iImg.prop('required', true);
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (this.files[0]) {
                indieauthor.utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                    $preview.attr('src', value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = (modelObject.data.text && modelObject.data.image && modelObject.params.name) ? modelObject.params.name : indieauthor.strings.widgets.Image.prev;
    },
    emptyData: function () {
        var object = {
            params: {
                name: this.widgetConfig.label + "-" + indieauthor.utils.generate_uuid(),
                help: "",
            },
            data: {
                text: "",
                image: "",
                blob: "",
                alt: ""
            }
        };

        return object;
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.text =indieauthor.widgetFunctions.clearAndSanitizeHtml(formJson.text);
        modelObject.data.blob = formJson.blob;
        modelObject.params.name = formJson.instanceName;
        modelObject.params.help = formJson.help;
        modelObject.data.alt = formJson.alt;
    },
    validateModel: function (widgetInstance) {
        var keys = [];

        if (!indieauthor.utils.isValidBase64DataUrl(widgetInstance.data.blob))
            keys.push("common.imageblob.invalid");

        if (!widgetInstance.data.text || (widgetInstance.data.text.length == 0))
            keys.push("Image.text.invalid");

        if (indieauthor.widgetFunctions.isEmptyText(widgetInstance.data.text))
            keys.push("TextBlock.text.invalid");

        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            keys.push("common.name.notUniqueName");

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.alt))
            keys.push("common.alt.invalid")

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

        if (!indieauthor.utils.isValidBase64DataUrl(formData.blob))
            keys.push("common.imageblob.invalid");

        if (formData.instanceName.length == 0)
            keys.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(formData.instanceName, instanceId))
            keys.push("common.name.notUniqueName");

        if (!formData.text || (formData.text.length == 0))
            keys.push("Image.text.invalid");

        if (indieauthor.widgetFunctions.isEmptyText(formData.text))
            keys.push("TextBlock.text.invalid");

        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.alt))
            keys.push("common.alt.invalid")

        return keys;
    },
    icon: " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADXUlEQVRoge2ZXUgUURSAz467mau4K5oh1NgPJT1EQsRAZBpERQUZxEBWVC/Sz4u+xNpTELS+WQ8ZDERP/ehLQRYJgoYiWRiSUBCEOj6Jbbqpa+vO7sSZnG22vXd3dnZnRsMPFnZ+7pzv3jlz5u5eB2hgOb4aAOrBXsYB4IU41DlLs4hLsxzfBgBNmyo2AH7s4t3Hz7Asfloc6hyharAcf4vleLn77XvZboJz8/KxCzdkluNnWI73ppKeefjsle3CKii+v/46ijeRfBmW4+sAwHvmRK3NqfyX4qJCOFK7D7dPkY4z6hc8cSXhSeHDrChTnaxJ55r8dS6vzy/U+fxCQhVJKS2L3yHqfx7/4LaVeIuL8GXXCwBjPr9wSQ3tpAqPTkDk+B2AYCi+L9r+BlxPm8BxYJfVg44j/cjnF8ZbWxr7qCMtnb2bIKwQDIF0RbDAkcpFoKUHjjItFXC/PPDFBl+FLfBfVQ/H7koAj5vcwuPOOqezvVPUkXY+aCTvbz2fVUDpqqA84LHH/YavQa0ezMm94Hp9E6Lt3X8eSI8b8q4dzWqUUViVxe8YnDlXkztpBAWdOSpvWmHtPiPiljyIJGE9x2iYLq1HKlNxU6UzkcnkXNOkjdx2vW1ST5hGJ0BqILzOcxTcaFuqNL6ulXraNZw0cco2qK5rdA1Tj5OlcWKkmTCRZnxmCatgTBrxOt0zsNyzXxGIPekHGSeDNZUJzRzN94FpqAFY70q6HI6MLIpJbYwytvgDr0psnTTSsZ5PIE8Fyb2fCiodwo4lCY+KOZHVQ4K0nuD/ilstDNr0kD980x08Ll7usVwYtNKYFpmgpBAljcxmVf4ISDnLQwKxCASikmkCO10FGbdJKz0YnoOXoYBRp7QIpTsybpNWuspZAOAuNcPXMGml8fYZuYVmsvZfnlWsWmlclIGvkUX7bTSMLM1DoZv8LDHiUCdK93WEpiEkk2dVVjMY/gmTUhi2sRXEyGr1aJ6Uwr23Z0Xv4QIvbM7Lt0U2JEdhZGlBka7azkJ5WQnxPEUa1+tYjt8aiEXaOham69Q/+uxgY1kJHKzek3ItM16nl1dIL5NO8vkF2a5OkNBbPegrp9aieOiVbl4BwpgJ90CvNC4Z4Fq1Wh5tAOMfam1ptCt+lgDAb7cafqL8lCv0AAAAAElFTkSuQmCC"
}