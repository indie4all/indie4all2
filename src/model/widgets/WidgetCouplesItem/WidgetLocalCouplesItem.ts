/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetCouplesItemData } from "../../../types";
import WidgetCouplesItem from "./WidgetCouplesItem";

export default class WidgetLocalCouplesItem extends WidgetCouplesItem {

    static async create(values?: InputWidgetCouplesItemData): Promise<WidgetLocalCouplesItem> {
        for (let idx in [0, 1]) {
            if (!values?.data?.couples[idx]?.blob && values?.data?.couples[idx]?.image) {
                const url = Utils.resourceURL(values.data.couples[idx].image);
                values.data.couples[idx].blob = await Utils.encodeURLAsBase64DataURL(url) as string;
                delete values.data.couples[idx].image;
            }
        }
        return new WidgetLocalCouplesItem(values);
    }

    constructor(values?: InputWidgetCouplesItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            couples: [
                { type: "", text: "", alt: "", blob: "" },
                { type: "", text: "", alt: "", blob: "" }
            ]
        };

    }

    clone(): WidgetLocalCouplesItem {
        const widget = new WidgetLocalCouplesItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
        var data = {
            instanceId: this.id,
            couples: this.data.couples
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.CouplesItem.label")
        };
    }

    settingsClosed(): void {
        $('#f-' + this.id).off('couples');
    }

    settingsOpened(): void {
        let self = this;
        let $form = $('#f-' + this.id);
        let $editors = $form.find('.texteditor');

        $('.img-preview').each(function (idx) {
            const $sectionPreview = $(this).closest('.form-group');
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

        $form.on('change.couples', '.img-input', function () {
            const input = <HTMLInputElement>this;
            const $ancestor = $(this).closest('.image');
            const $blob = $ancestor.find('.blob-input');
            const $preview = $ancestor.find('.img-preview');
            const $sectionPreview = $preview.closest('.form-group');
            const $self = $(this);
            $self.prop("required", true);
            $blob.val('');
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (input.files) {
                Utils.encodeBlobAsBase64DataURL(input.files[0]).then(value => {
                    $self.prop('required', false);
                    $blob.val(<string>value);
                    $preview.attr('src', <string>value);
                    $sectionPreview.toggleClass('d-none', false);
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
            if (couple.type === 'image' && !Utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");
        });
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        form.couple.forEach(couple => {
            if (couple.type === 'image' && !Utils.isValidBase64DataUrl(couple.blob))
                errors.push("common.imageblob.invalid");
        });
        return errors;
    }

}
