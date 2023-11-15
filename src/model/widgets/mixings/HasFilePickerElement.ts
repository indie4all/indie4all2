/* global $ */
import Config from "../../../Config";
import FilePicker from "../../../file-picker/FilePicker";
import I18n from "../../../I18n";

export default function HasFilePickerElement<TBase extends abstract new (...args: any[]) => any>(Base: TBase) {


    abstract class HasFilePicker extends Base {

        initFilePicker($input: JQuery, readonly = true) {
            if (Config.getMediaResourcesURL()) {
                const $parent = $input.parent();
                const $sibling = $input.prev();
                const text = I18n.getInstance().translate("common.file-picker.button");
                // Wrap the input in a button-prepend structure
                const $wrapper = $(`<div class="input-group">
                  <div class="input-group-prepend">
                    <button class="btn btn-indie js-file-picker" type="button">${text}</button>
                  </div>
                </div>`);
                if ($sibling.length) $sibling.after($wrapper)
                else $parent.append($wrapper);
                $wrapper.append($input);

                readonly && $input.attr('readonly', 'readonly');
                $wrapper.on('click', '.js-file-picker', function (e) {
                    const filePicker = new FilePicker(Config.getMediaResourcesURL());
                    filePicker.setOnSubmit((url: string) => {
                        $input.val(url).trigger('change');
                    });
                    // The form-edit modal is still open after we close the file picker
                    filePicker.setOnHidden(() => {
                        $('body').addClass('modal-open');
                    });
                    filePicker.show();
                })
            }
        }
    }
    return HasFilePicker;
}