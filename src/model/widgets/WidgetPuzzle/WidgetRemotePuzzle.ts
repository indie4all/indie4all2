import "./styles.scss";
import { FormEditData, InputWidgetPiecesElementData } from "../../../types";
import WidgetPuzzle from "./WidgetPuzzle";
import Utils from "../../../Utils";

export default class WidgetRemotePuzzle extends WidgetPuzzle {

    static async create(values?: InputWidgetPiecesElementData): Promise<WidgetRemotePuzzle> {
        // TODO Local to remote resources
        if (!values?.data?.image && values?.data?.blob)
            throw new Error("Conversion from Local to Remote is not currently supported");
        return new WidgetRemotePuzzle(values);
    }

    constructor(values?: InputWidgetPiecesElementData) { super(values); }

    clone(): WidgetRemotePuzzle {
        const widget = new WidgetRemotePuzzle();
        widget.params = structuredClone(this.params);
        widget.params.name = WidgetRemotePuzzle.widget + "-" + widget.id;
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
            widget: WidgetRemotePuzzle.widget
        };
        return {
            inputs: form(data),
            title: this.translate("widgets." + WidgetRemotePuzzle.widget + ".label")
        };
    }

    settingsOpened() {
        super.settingsOpened();
        const self = this;
        const $form = $('#f-' + self.id);
        $form.on('change.pieces', 'input[name="image"]', function (e) {
            $form.find('.pieces-wrapper').addClass('d-none');
            if (Utils.isIndieResource(e.target.value))
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
        if (!Utils.isIndieResource(this.data.image))
            errors.push(WidgetRemotePuzzle.widget + ".image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        !Utils.isIndieResource(this.data.image) && errors.push(WidgetRemotePuzzle + ".image.invalid");
        return errors;
    }
}
