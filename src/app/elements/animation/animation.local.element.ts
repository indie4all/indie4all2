import './styles.scss';
import { InputWidgetPiecesElementData, WidgetInitOptions } from '../../../types';
import AnimationElement from './animation.element';

export default class AnimationLocalElement extends AnimationElement {

    constructor() { super(); }

    async init(values?: InputWidgetPiecesElementData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = this.utils.resourceURL(values.data.image);
            values.data.blob = await this.utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        await super.init(values, options);
    }

    get form() {
        return import('./form-local.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                blob: this.data.blob,
                pieces: this.data.pieces,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt,
                widget: AnimationLocalElement.widget
            }));
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
                this.utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
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
        if (!this.utils.isValidBase64DataUrl(this.data.blob))
            errors.push("common.imageblob.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        !this.utils.isValidBase64DataUrl(form.blob) && errors.push("common.imageblob.invalid");
        return errors;
    }
}