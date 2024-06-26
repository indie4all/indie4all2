import "./styles.scss";
import { FormEditData, InputWidgetPiecesElementData } from "../../../types";
import WidgetPuzzle from "./WidgetPuzzle";
import Utils from "../../../Utils";

export default class WidgetLocalPuzzle extends WidgetPuzzle {

    static async create(values?: InputWidgetPiecesElementData): Promise<WidgetLocalPuzzle> {
        if (!values?.data?.blob && values?.data?.image) {
            const url = Utils.resourceURL(values.data.image);
            values.data.blob = await Utils.encodeURLAsBase64DataURL(url) as string;
            delete values.data.image;
        }
        return new WidgetLocalPuzzle(values);
    }

    constructor(values?: InputWidgetPiecesElementData) { super(values); }

    clone(): WidgetLocalPuzzle {
        const widget = new WidgetLocalPuzzle();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetLocalPuzzle.widget + "-" + widget.id;
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
            widget: WidgetLocalPuzzle.widget
        };
        return {
            inputs: form(data),
            title: this.translate("widgets." + WidgetLocalPuzzle.widget + ".label")
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
