/* global $ */
import "./styles.scss";
import { InputWidgetCouplesItemData, WidgetInitOptions } from "../../../types";
import CouplesItemElement from "./couples-item.element";

export default class CouplesItemLocalElement extends CouplesItemElement {

    constructor() { super(); }

    async init(values?: InputWidgetCouplesItemData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        for (let idx in [0, 1]) {
            if (!values?.data?.couples[idx]?.blob && values?.data?.couples[idx]?.image) {
                const url = this.utils.resourceURL(values.data.couples[idx].image);
                values.data.couples[idx].blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
                delete values.data.couples[idx].image;
            }
        }
        await super.init(values, options);
        this.data = values?.data ? structuredClone(values.data) : {
            couples: [
                { type: "", text: "", alt: "", blob: "" },
                { type: "", text: "", alt: "", blob: "" }
            ]
        };
    }

    get form() {
        return import('./form-local.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                couples: this.data.couples
            }));
    }

    settingsClosed(): void {
        $('#f-' + this.id).off('couples');
    }

    settingsOpened(): void {
        let self = this;
        let $form = $('#f-' + this.id);
        let $editors = $form.find('.texteditor');

        $('.img-preview').each(function (idx) {
            const $sectionPreview = $(this).closest('.img-preview-wrapper');
            $sectionPreview.toggleClass('d-none', !self.data.couples[idx].blob);
        });

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
            const input = e.target as HTMLInputElement;
            const ancestor = input.closest('.image');
            const blob = ancestor.querySelector('.blob-input') as HTMLInputElement;
            const preview = ancestor.querySelector('.img-preview') as HTMLImageElement;
            const sectionPreview = preview.closest('.img-preview-wrapper');
            input.required = true;
            blob.value = '';
            preview.src = '';
            sectionPreview.classList.toggle('d-none', true);
            if (input.files) {
                this.utils.encodeBlobAsBase64DataURL(input.files[0]).then((value: string) => {
                    input.required = false;
                    blob.value = value;
                    preview.src = value;
                    sectionPreview.classList.toggle('d-none', false);
                });
            }
        });
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.couples[0].blob = form.couple[0].blob;
        this.data.couples[1].blob = form.couple[1].blob;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        this.data.couples.forEach(couple => {
            if (couple.type === 'image' && !this.utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");
        });
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        form.couple.forEach(couple => {
            if (couple.type === 'image' && !this.utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");
        });
        return errors;
    }

}
