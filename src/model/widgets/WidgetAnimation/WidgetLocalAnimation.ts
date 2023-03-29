import './styles.scss';
import { FormEditData, InputWidgetPiecesElementData } from '../../../types';
import WidgetAnimation from './WidgetAnimation';
import Utils from '../../../Utils';

export default class WidgetLocalAnimation extends WidgetAnimation {

    static async create(values?: InputWidgetPiecesElementData): Promise<WidgetLocalAnimation> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = Utils.resourceURL(values.data.image);
            values.data.blob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        return new WidgetLocalAnimation(values);
    }

    constructor(values?: any) { super(values); }

    clone(): WidgetLocalAnimation {
        const widget = new WidgetLocalAnimation();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetLocalAnimation.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-local.hbs');
        var data = {
            instanceId: this.id,
            blob: this.data.blob,
            pieces: this.data.pieces,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt,
            widget: WidgetLocalAnimation.widget
        };
        return {
            inputs: form(data),
            title: this.translate("widgets." + WidgetLocalAnimation.widget + ".label")
        };
    }

    settingsOpened() {
        super.settingsOpened();
        const self = this;
        const $iImg = $('input[name=image]');
        const $iBlob = $('input[name=blob]');
        let $form = $('#f-' + this.id);
        $form.on('change.pieces', 'input[name="image"]', function () {
            $form.find('.pieces-wrapper').addClass('d-none');
            $iBlob.val('');
            $iImg.prop('required', true);
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    self.loadImage(value as string);
                    $iImg.prop('required', false);
                    $iBlob.val(value as string);
                });
            }
        });

        this.data.blob && self.loadImage(this.data.blob);
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.blob = form.blob;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!Utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        !Utils.isValidBase64DataUrl(form.blob) && errors.push("common.imageblob.invalid");
        return errors;
    }
}