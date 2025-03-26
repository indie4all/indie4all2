/* global $ */
import "./styles.scss";
import { InputWidgetCouplesItemData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import CouplesItemElement from "./couples-item.element";

export default class CouplesItemRemoteElement extends HasFilePickerElement(CouplesItemElement) {

    constructor() { super(); }

    async init(values?: InputWidgetCouplesItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        for (let idx in [0, 1]) {
            if (values?.data?.couples[idx]?.blob && !values?.data?.couples[idx]?.image) {
                const url = await this.utils.base64DataURLToURL(values.data.couples[idx].blob);
                values.data.couples[idx].image = url;
                delete values.data.couples[idx].blob;
            }
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : {
            couples: [
                { type: "", text: "", alt: "", image: "" },
                { type: "", text: "", alt: "", image: "" }
            ]
        };
    }

    get form() {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                couples: this.data.couples
            }));
    }

    settingsClosed(): void {
        $('#f-' + this.id).off('couples');
    }

    settingsOpened() {
        let self = this;
        let $form = $('#f-' + this.id);
        let $editors = $form.find('.texteditor');
        let $imgs = $form.find('.img-input');

        $('.img-preview').each(function (idx) {
            const $sectionPreview = $(this).closest('.img-preview-wrapper');
            $sectionPreview.toggleClass('d-none', !self.data.couples[idx].image);
            $(this).on('error', function () {
                const emptySrc = (this as HTMLImageElement).src === window.location.href;
                $form.find('.preview-error').toggleClass('d-none', emptySrc);
                $sectionPreview.toggleClass('d-none', true);
            });
        });

        $imgs.each(function () { self.initFilePicker($(this)); });

        $editors.each(function (idx) {
            self.initTextEditor(self.data.couples[idx].text, `#f-${self.id} #text-${idx}-${self.id}`);
        });

        $form.on('change.couples', 'input[type=radio]', function () {
            let $anchor = $(this).closest('.couple');
            $anchor.find('.text').toggleClass("d-none", this.value === "image");

            $anchor.find('.image input').prop('required', this.value === "image");
            $anchor.find('.image').toggleClass("d-none", this.value !== "image");
        });

        $form.on('change.couples', '.img-input', (e) => {
            const ancestor = (e.target as HTMLElement).closest('.image');
            const preview = ancestor.querySelector('.img-preview');
            const sectionPreview = preview.closest('.img-preview-wrapper');
            ancestor.querySelector('.preview-error').classList.toggle('d-none', true);
            preview.setAttribute('src', '');
            sectionPreview.classList.toggle('d-none', true);
            if (this.utils.isValidResource(e.target.value)) {
                preview.setAttribute('src', e.target.value);
                sectionPreview.classList.toggle('d-none', false);
            }
        });
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.couples[0].image = form.couple[0].image;
        this.data.couples[1].image = form.couple[1].image;
    }

    validateModel(): string[] {

        const errors = super.validateModel();
        this.data.couples.forEach(couple => {
            if (couple.type === 'image' && !this.utils.isValidResource(couple.image))
                errors.push("CouplesItem.image.invalid");
        });
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        form.couple.forEach(couple => {
            if (couple.type === 'image' && !this.utils.isValidResource(couple.image))
                errors.push("CouplesItem.image.invalid");
        });
        return errors;
    }

}
