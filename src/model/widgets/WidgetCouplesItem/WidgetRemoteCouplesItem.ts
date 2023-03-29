/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import { FormEditData, InputWidgetCouplesItemData } from "../../../types";
import WidgetCouplesItem from "./WidgetCouplesItem";

export default class WidgetRemoteCouplesItem extends WidgetCouplesItem {

    static async create(values?: InputWidgetCouplesItemData): Promise<WidgetRemoteCouplesItem> {
        for (let idx in [0, 1]) {
            if (values?.data?.couples[idx]?.blob && !values?.data?.couples[idx]?.image) {
                throw new Error("Conversion from Local to Remote is not currently supported");
            }
        }
        return new WidgetRemoteCouplesItem(values);
    }

    constructor(values?: InputWidgetCouplesItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : {
            couples: [
                { type: "", text: "", alt: "", image: "" },
                { type: "", text: "", alt: "", image: "" }
            ]
        };

    }

    clone(): WidgetRemoteCouplesItem {
        const widget = new WidgetRemoteCouplesItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        var data = {
            instanceId: this.id,
            couples: this.data.couples
        }
        return {
            inputs: form(data),
            title: this.translate("widgets.CouplesItem.label")
        };
    }

    settingsClosed(): void {
        $('#f-' + this.id).off('couples');
    }

    settingsOpened() {
        let self = this;
        let $form = $('#f-' + this.id);
        let $editors = $form.find('.texteditor');

        $('.img-preview').each(function (idx) {
            const $sectionPreview = $(this).closest('.form-group');
            $sectionPreview.toggleClass('d-none', !self.data.couples[idx].image);
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

        $form.on('change.couples', '.img-input', function (e) {
            const $ancestor = $(this).closest('.image');
            const $preview = $ancestor.find('.img-preview');
            const $sectionPreview = $preview.closest('.form-group');
            $preview.attr('src', '');
            $sectionPreview.toggleClass('d-none', true);
            if (Utils.isIndieResource(e.target.value)) {
                $preview.attr('src', e.target.value);
                $sectionPreview.toggleClass('d-none', false);
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
            if (couple.type === 'image' && !Utils.isIndieResource(couple.image))
                errors.push("CouplesItem.image.invalid");
        });
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        form.couple.forEach(couple => {
            if (couple.type === 'image' && !Utils.isIndieResource(couple.image))
                errors.push("CouplesItem.image.invalid");
        });
        return errors;
    }

}
