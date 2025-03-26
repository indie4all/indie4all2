import './styles.scss';
import { InputWidgetPiecesElementData, WidgetInitOptions } from '../../../types';
import HasFilePickerElement from '../mixings/HasFilePickerElement';
import AnimationElement from './animation.element';

export default class AnimationRemoteElement extends HasFilePickerElement(AnimationElement) {

    constructor() { super(); }

    async init(values?: InputWidgetPiecesElementData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.image && values?.data?.blob) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values, options);
    }

    get form() {
        return import('./form-remote.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                image: this.data.image,
                pieces: this.data.pieces,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt,
                widget: AnimationRemoteElement.widget
            }));
    }

    settingsOpened() {
        super.settingsOpened();
        const self = this;
        const $form = $('#f-' + self.id);
        $form.on('change.pieces', 'input[name="image"]', (e) => {
            $form.find('.pieces-wrapper').addClass('d-none');
            if (this.utils.isValidResource(e.target.value))
                self.loadImage(e.target.value);
        });
        this.data.image && self.loadImage(this.data.image);
        this.initFilePicker($form.find('input[name="image"]'));
    }

    settingsClosed() {
        $(`#f-${this.id}`).trigger('destroyCanvas.pieces');
        $(`#f-${this.id}`).off('pieces');
        $(window).off('pieces');
    }

    updateModelFromForm(form: any): void {
        super.updateModelFromForm(form);
        this.data.image = form.image;
    }

    validateModel(): string[] {
        const errors = super.validateModel();
        if (!this.utils.isValidResource(this.data.image))
            errors.push(AnimationRemoteElement.widget + ".image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        !this.utils.isValidResource(form.image) && errors.push(AnimationRemoteElement.widget + ".image.invalid");
        return errors;
    }
}