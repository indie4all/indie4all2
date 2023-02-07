/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetChooseOption extends WidgetItemElement {

    static widget = "ChooseOption";
    static type = "element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-choose-option";

    extensions = {
        optionsNumber: 4,
        optionsWithoutCorrect: function (options) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.correct)
                    return false;
            }
            return true;
        },
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                text: this.data.text,
                blob: this.data.blob,
                options: this.data.options,
                instanceName: this.params.name,
                help: this.params.help,
                alt: this.data.alt
            };

            return {
                inputs: form(data),
                title: this.translate("widgets.ChooseOption.label")
            };
        });
    }

    constructor(values) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Choose option-" + Utils.generate_uuid(),
            help: "",
        };
        this.data = values?.data ? structuredClone(values.data) : {
            text: "", blob: "", alt: "",
            options: [
                {text: "", correct: false}, {text: "", correct: false},
                {text: "", correct: false}, {text: "", correct: false}
            ]
        }
    }

    clone() {
        return new WidgetChooseOption(this);
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name ="Choose option-" + this.id;
    }

    settingsOpened() {
        const $form = $('#f-' + this.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !this.data.blob);
        $sectionPreview.toggleClass('d-none', !this.data.blob);

        $iImg.on('change', function () {
            $sectionPreview.toggleClass('d-none', true);
            $iImg.prop('required', true);
            $iBlob.val('');
            if (this.files[0]) {
                Utils.encodeBlobAsBase64DataURL(this.files[0]).then(value => {
                    $iImg.prop('required', false);
                    $iBlob.val(value);
                    $preview.attr('src', value);
                    $sectionPreview.toggleClass('d-none', false);
                });
            }
        });
    }

    preview() {
        return this.params?.name && this.data?.text ? 
            this.params.name + " | " + this.data.text : this.translate("widgets.ChooseOption.prev");
    }

    updateModelFromForm(form) {
        var options = [];
        for (var i = 0; i < this.extensions.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({text: option, correct: parseInt(form.correct) == i })
            }
        }

        this.data.options = options;
        this.data.blob = form.blob;
        this.data.text = form.text;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel() {
        var errors = [];
        if (this.data.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (!Utils.isValidBase64DataUrl(this.data.blob)) errors.push("common.imageblob.invalid");
        if (this.extensions.optionsWithoutCorrect(this.data.options))
            errors.push("ChooseOption.options.noCorrect");
        if (this.data.options.length != this.extensions.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (!Utils.hasNameInParams(this))
            errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form) {
        var errors = [];
        var options = [];

        for (var i = 0; i < this.extensions.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({text: option, correct: parseInt(form.correct) == i })
            }
        }

        if (form.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (!Utils.isValidBase64DataUrl(form.blob)) errors.push("common.imageblob.invalid");
        if (this.extensions.optionsWithoutCorrect(options)) 
            errors.push("ChooseOption.options.noCorrect");
        if (options.length != this.extensions.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
