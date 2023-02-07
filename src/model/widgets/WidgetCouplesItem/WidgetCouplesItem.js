/* global $ */
import Utils from "../../../Utils";
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetCouplesItem extends WidgetItemElement {

    static widget = "CouplesItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-couple-item";
    static paletteHidden = true;

    constructor(values) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.data = values?.data ? structuredClone(values.data) : {
            couples: [
                { type: "", text: "", alt: "", blob: "" },
                { type: "", text: "", alt: "", blob: ""}
            ]
        };

    }

    clone() {
        return new WidgetCouplesItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                couples: this.data.couples
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.CouplesItem.label")
            };
        });
    }

    settingsClosed() {
        $('#f-' + this.id).off('couples');
    }

    settingsOpened() {
        let self = this;
        let $form = $('#f-' + this.id);
        let $editors = $form.find('.texteditor');

        $('.img-preview').each(function(idx) {
          const $sectionPreview = $(this).closest('.form-group');
          $sectionPreview.toggleClass('d-none', !self.data.couples[idx].blob);
        });
        
        $editors.each(function (idx) {
            self.initTextEditor(self.data.couples[idx].text, $(this));
        });
        
        $form.on('change.couples', 'input[type=radio]', function () {
            let $anchor = $(this).closest('.couple');
            $anchor.find('.text textarea').prop('required', this.value !== "image");
            $anchor.find('.text').toggleClass("d-none", this.value === "image");

            $anchor.find('.image input').prop('required', this.value === "image");
            $anchor.find('.image').toggleClass("d-none", this.value !== "image");
        });

        $form.on('change.couples', '.img-input', function() {
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
              Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                  $self.prop('required', false);
                  $blob.val(value);
                  $preview.attr('src', value);
                  $sectionPreview.toggleClass('d-none', false);
              });
          }
        });
    }

    preview() {
        const couples = this.data.couples.filter(couple => ["image", "text"].includes(couple.type));
        return couples.length === 2 ?  
            couples.map(couple => couple.type === "image" ? `<div>${couple.alt}</div>` : `<div>${couple.text}</div>`).join(' -> ') :
            this.translate("widgets.CouplesItem.prev");
    }

    updateModelFromForm(form) {
        this.data.couples[0].type = form.couple[0].type;
        this.data.couples[1].type = form.couple[1].type;
        this.data.couples[0].text = form.couple[0].text;
        this.data.couples[1].text = form.couple[1].text;
        this.data.couples[0].blob = form.couple[0].blob;
        this.data.couples[1].blob = form.couple[1].blob;
        this.data.couples[0].alt = form.couple[0].alt;
        this.data.couples[1].alt = form.couple[1].alt;
    }

    validateModel() {

        var errors = [];
        this.data.couples.forEach(couple => {
            if (couple.type !== 'text' && couple.type !== 'image') 
                errors.push("CouplesItem.type.invalid");
            if (couple.type === 'text' && Utils.isStringEmptyOrWhitespace(couple.text))
                errors.push("CouplesItem.text.invalid");
            if (couple.type === 'image' && !Utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");
            if (couple.type === 'image' && Utils.isStringEmptyOrWhitespace(couple.alt))
                errors.push("common.alt.invalid")
        });
        return errors;
    }

    validateForm(form) {
        var errors = [];
        form.couple.forEach(couple => {
            if (couple.type !== 'text' && couple.type !== 'image')
                errors.push("CouplesItem.type.invalid");
            if (couple.type === 'text' && Utils.isStringEmptyOrWhitespace(couple.text))
                errors.push("CouplesItem.text.invalid");
            if (couple.type === 'image' && !Utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");
            if (couple.type === 'image' && Utils.isStringEmptyOrWhitespace(couple.alt))
                errors.push("common.alt.invalid")
        });
        return errors;
    }

}
