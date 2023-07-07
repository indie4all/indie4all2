import './styles.scss';
import { FormEditData, InputWidgetPiecesElementData } from '../../../types';
import WidgetAnimationDelegate from './WidgetAnimation';
import Utils from '../../../Utils';

export default class WidgetRemoteAnimation extends WidgetAnimationDelegate {

    static async create(values?: InputWidgetPiecesElementData): Promise<WidgetRemoteAnimation> {
        // TODO Local to remote resources
        if (!values?.data?.image && values?.data?.blob) {
            const url = await Utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
            //throw new Error("Conversion from Local to Remote is not currently supported");
        }
        return new WidgetRemoteAnimation(values);
    }

    constructor(values?: any) { super(values); }

    clone(): WidgetRemoteAnimation {
        const widget = new WidgetRemoteAnimation();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetRemoteAnimation.widget + "-" + widget.id;
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form-remote.hbs');
        var data = {
            instanceId: this.id,
            image: this.data.image,
            pieces: this.data.pieces,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt,
            widget: WidgetRemoteAnimation.widget
        };
        return {
            inputs: form(data),
            title: this.translate("widgets." + WidgetRemoteAnimation.widget + ".label")
        };
    }

    settingsOpened() {
        super.settingsOpened();
        const self = this;
        const $form = $('#f-' + self.id);
        $form.on('change.pieces', 'input[name="image"]', function (e) {
            $form.find('.pieces-wrapper').addClass('d-none');
            if (Utils.isValidResource(e.target.value))
                self.loadImage(e.target.value);
        });
        this.data.image && self.loadImage(this.data.image);
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
        if (!Utils.isValidResource(this.data.image))
            errors.push(WidgetRemoteAnimation.widget + ".image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        !Utils.isValidResource(this.data.image) && errors.push(WidgetRemoteAnimation.widget + ".image.invalid");
        return errors;
    }
}