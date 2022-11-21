indieauthor.widgets.CouplesItem = {
    widgetConfig: {
        widget: "CouplesItem",
        type: "specific-element",
        label: "Couples Item",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) { },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function (options) {
        return '<div class="widget widget-couple-item" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/></div><div class="b2" data-prev><span>{{translate "widgets.CouplesItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            couples: modelObject.data.couples
        }

        var template = `
        <form id="f-{{instanceId}}">
          {{#each couples}}
          <fieldset class="couple">
            <legend class="text-center">
              {{#if @index}}
                {{translate "widgets.CouplesItem.form.legend.second"}}
              {{else}}
                {{translate "widgets.CouplesItem.form.legend.first"}}
              {{/if}}</legend>
            <fieldset class="form-group">
              <div class="row">
                <legend class="col-form-label col-sm-2 pt-0">{{translate "widgets.CouplesItem.form.type.label"}}</legend>
                <div class="col-sm-10">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="couple[{{@index}}][type]" id="couple-{{@index}}-type-text" value="text" {{#ifneq type "image"}} checked {{/ifneq}} required>
                    <label class="form-check-label" for="couple-{{@index}}-type-text">
                      {{translate "widgets.CouplesItem.form.type.text"}}
                    </label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="couple[{{@index}}][type]" id="couple-{{@index}}-type-image" value="image" {{#ifeq type "image"}} checked {{/ifeq}} required>
                    <label class="form-check-label" for="couple-{{@index}}-type-image">
                      {{translate "widgets.CouplesItem.form.type.image"}}
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="form-group text {{#ifeq type "image"}} d-none {{/ifeq}}">
              <label for="text-{{@index}}-{{instanceId}}">{{translate "widgets.CouplesItem.form.text.label"}}</label>
              <textarea rows="5" class="form-control texteditor" id="text-{{@index}}-{{instanceId}}" name="couple[{{@index}}][text]" placeholder="{{translate "widgets.CouplesItem.form.text.placeholder"}}" {{#ifneq type "image"}} required {{/ifneq}} ></textarea>
              <small class="form-text text-muted">{{translate "widgets.CouplesItem.form.text.help"}}</small>
            </div>
            <div class="image {{#ifneq type "image"}} d-none {{/ifneq}}">
              <div class="form-group">
                <label for="image">{{translate "widgets.CouplesItem.form.image.label"}}</label>
                <input type="file" class="form-control img-input" name="couple[{{@index}}][image]" accept="image/png, image/jpeg" />
                <small class="form-text text-muted">{{translate "widgets.CouplesItem.form.image.help"}}</small>
                <input type="hidden" class="blob-input" name="couple[{{@index}}][blob]" value="{{blob}}" />
              </div>
              <div class="form-group">
                <label for="alt">{{translate "common.alt.label"}}</label>
                <input type="text" class="form-control" name="couple[{{@index}}][alt]" {{#ifeq type "image"}} required {{/ifeq}} autocomplete="off" placeholder="{{translate "common.alt.placeholder"}}" value="{{alt}}"/>
                <small class="form-text text-muted">{{translate "common.alt.help"}}</small>
              </div>
              <div class="form-group d-none">
                <p>{{translate "widgets.CouplesItem.form.preview"}}</p>
                <img class="img-fluid img-preview" src="{{blob}}"/>
              </div>
            </div>
          </fieldset>
          {{/each}}
        </form>
        `;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.CouplesItem.label
        };
    },
    settingsClosed: function (modelObject) {
        $('#f-' + modelObject.id).off('couples');
    },
    settingsOpened: function (modelObject) {
        let $form = $('#f-' + modelObject.id);
        let $editors = $form.find('.texteditor');

        $('.img-preview').each(function(idx) {
          const $sectionPreview = $(this).closest('.form-group');
          $sectionPreview.toggleClass('d-none', !modelObject.data.couples[idx].blob);
        });
        
        $editors.each(function (idx) {
            indieauthor.widgetFunctions.initTextEditor(modelObject.data.couples[idx].text, $(this));
        });
        $form.on('change.couples', 'input[type=radio]', function () {
            let $anchor = $(this).closest('.couple');
            $anchor.find('.text textarea').prop('required', this.value !== "image");
            $anchor.find('.text').toggleClass("d-none", this.value === "image");

            $anchor.find('.image input').prop('required', this.value === "image");
            $anchor.find('.image').toggleClass("d-none", this.value !== "image");
        });

        $form.on('change.couples', '.img-input', function(e) {
          const $ancestor = $(this).closest('.image');
          const $blob = $ancestor.find('.blob-input');
          const $preview = $ancestor.find('.img-preview');
          const $sectionPreview = $preview.closest('.form-group');
          const $self = $(this);
          $self.prop("required", true);
          $blob.val('');
          $preview.attr('src', '');
          $sectionPreview.toggleClass('d-none', true);
          if (this.files[0]) {
              indieauthor.utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                  $self.prop('required', false);
                  $blob.val(value);
                  $preview.attr('src', value);
                  $sectionPreview.toggleClass('d-none', false);
              });
          }
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        let couples = modelObject.data.couples.filter(couple => ["image", "text"].includes(couple.type));
        if (couples.length === 2) {
            let html = couples.map(couple => couple.type === "image" ? `<div>${couple.alt}</div>` : `<div>${couple.text}</div>`).join(' -> ');
            element.innerHTML = html
        }
        else
            element.innerHTML = indieauthor.strings.widgets.CouplesItem.prev;
    },
    emptyData: function (options) {
        var object = {
            data: {
                couples: [
                    { type: "", text: "", alt: "", blob: "" },
                    { type: "", text: "", alt: "", blob: ""}
                ]
            }
        };

        return object
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.couples[0].type = formJson.couple[0].type;
        modelObject.data.couples[1].type = formJson.couple[1].type;
        modelObject.data.couples[0].text = formJson.couple[0].text;
        modelObject.data.couples[1].text = formJson.couple[1].text;
        modelObject.data.couples[0].blob = formJson.couple[0].blob;
        modelObject.data.couples[1].blob = formJson.couple[1].blob;
        modelObject.data.couples[0].alt = formJson.couple[0].alt;
        modelObject.data.couples[1].alt = formJson.couple[1].alt;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        widgetInstance.data.couples.forEach(couple => {
            if (couple.type !== 'text' && couple.type !== 'image')
                errors.push("CouplesItem.type.invalid");

            if (couple.type === 'text' && indieauthor.utils.isStringEmptyOrWhitespace(couple.text))
                errors.push("CouplesItem.text.invalid");

            if (couple.type === 'image' && !indieauthor.utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");

            if (couple.type === 'image' && indieauthor.utils.isStringEmptyOrWhitespace(couple.alt))
                errors.push("common.alt.invalid")
        });

        if (errors.length > 0)
            return {
                element: widgetInstance.id,
                keys: errors
            }

        return undefined;
    },
    validateForm: function (formData) {
        var errors = [];
        formData.couple.forEach(couple => {
            if (couple.type !== 'text' && couple.type !== 'image')
                errors.push("CouplesItem.type.invalid");

            if (couple.type === 'text' && indieauthor.utils.isStringEmptyOrWhitespace(couple.text))
                errors.push("CouplesItem.text.invalid");

            if (couple.type === 'image' && !indieauthor.utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");

            if (couple.type === 'image' && indieauthor.utils.isStringEmptyOrWhitespace(couple.alt))
                errors.push("common.alt.invalid")
        });
        return errors;
    },
    icon: "data:image/png;base64,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"
}