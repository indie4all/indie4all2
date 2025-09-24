import "./styles.scss";
import { InputWidgetPiecesElementData, WidgetInitOptions } from "../../../types";
import HasFilePickerElement from "../mixings/HasFilePickerElement";
import PuzzleElement from "./puzzle.element";
import { FilePickerType } from "../../services/file-picker/types";

export default class PuzzleRemoteElement extends HasFilePickerElement(PuzzleElement) {

    constructor() { super(); }

    async init(values?: InputWidgetPiecesElementData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        if (!values?.data?.image && values?.data?.blob) {
            const url = await this.utils.base64DataURLToURL(values.data.blob);
            values.data.image = url;
            delete values.data.blob;
        }
        await super.init(values, options);
    }

    get form(): Promise<string> {
        return import('./form-remote.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            image: this.data.image,
            pieces: this.data.pieces,
            instanceName: this.params.name,
            help: this.params.help,
            alt: this.data.alt,
            widget: PuzzleRemoteElement.widget
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
        this.initFilePicker($form.find('input[name="image"]'), FilePickerType.IMAGE);
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
            errors.push(PuzzleRemoteElement.widget + ".image.invalid");
        return errors;
    }

    validateForm(form: any): string[] {
        const errors = super.validateForm(form);
        !this.utils.isValidResource(form.image) && errors.push(PuzzleRemoteElement.widget + ".image.invalid");
        return errors;
    }
}
