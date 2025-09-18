/* global $ */
import Config from "../../../config";
import ContainerManager from "../../../container.manager";
import FilePickerService from "../../services/file-picker/file-picker.service";
import I18nService from "../../services/i18n/i18n.service";

export default function HasFilePickerElement<TBase extends abstract new (...args: any[]) => any>(Base: TBase) {

    abstract class HasFilePicker extends Base {

        initFilePicker($input: JQuery, readonly = true) {
            if (Config.getMediaResourcesURL()) {
                const $parent = $input.parent();
                const $sibling = $input.prev();
                const i18n = ContainerManager.instance.get(I18nService);
                const text = i18n.value("common.file-picker.button");
                // Wrap the input in a button-prepend structure
                const $wrapper = $(`<div class="input-group mb-1">
                    <button class="btn btn-indie js-file-picker" type="button">${text}</button>
                </div>`);
                if ($sibling.length) $sibling.after($wrapper)
                else $parent.append($wrapper);
                $wrapper.append($input);

                readonly && $input.attr('readonly', 'readonly');
                $wrapper.on('click', '.js-file-picker', function (e) {
                    const filePicker = ContainerManager.instance.get(FilePickerService);
                    filePicker.init(Config.getMediaResourcesURL());
                    filePicker.setOnSubmit((url: string) => {
                        $input.val(url).trigger('change');
                    });
                    // The form-edit modal is still open after we close the file picker
                    filePicker.setOnHidden(() => document.body.classList.add('modal-open'));
                    filePicker.show();
                })
            }
        }
    }
    return HasFilePicker;
}