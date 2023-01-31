/* global $ */
import form from "./form.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetChooseOption extends WidgetItemElement {

    static widget = "ChooseOption";
    static type = "element";
    static label = "Choose option";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADPUlEQVRoBe2ZT0gUURzHvy5atOq6ghZCTVJUJARRyERF6kVyDTKQ0YtFBgvZZZcidwkz67BbINalYKM/dgizDl0s7OJulzJDAmsOdlmXoIOB/710mPgNO2YwM/ue7uzYsh9YnMU3bz4783u/35v38rAKQZQOAmiCvcQBvE6MDs4aWaxIC6LUB8C3vaIc9LGLj+MykuJnEqODXww1BFG6IYiSMhz7pNjN3MKicrLtqiKI0owgSm4z6ZlHA0O2C2uQ+NGmSyTu0/N1CKJUC8Dd3Fhjcyj/xVVUiPqaavp+Wu//Du2AGm4kSkx8HBvKlJGcdLrZvKnAHQhFagOhyD9ZJN/sOvL3OHr6+rXcmXaoHtCA6/ad0+3a7SqiYjcCYDYQivjDQe9TU+n5xSW0dNxUj9tbPaYDY618GP+GxwNvsKOiHO0tHrNe6E4/CYQi8XDQGzWUlienML+whId3rqD+RLUld9qHZjSc7cRwbCyVtAY9kmjKmLY6FbqKnDzNK5HLHhkkJ50pUkpT6rOS+cVl7t4NU96RQ1VwFRfi8q0HaG6ULcvT8mQc3X794mKEaUV8cf+6Kk0FwAqoIlLhYszRK5hKV+2pxNtnty0RXg//5UA0vdOYW4YyMcXWU4kTeQd2qoc0eGkawIKr2Kk+0bRJ/z52DUriF3NnBV/7kCeUqTPDV0Mx5vN6uzrA87pnGh48wiqJafXPj5/TXKfxts++mM5/7oMykWDriWL6+H71kPLuu9hnZon21gbmtkgl7Th1GKAPJzSweAcXD9kXHj13+9UyywKV/N6ui+pLA2WOl0NRZgkKJ54nYyrNW77lFo86ZyFhnpdhin8e6eybmlbtZf/1FB7aEjHPeUjOKHkwDY+1TpZoHcNoLSMd5F63MkVOOlM4kpsyli0yrpXh92ModG7RPduRGB0k6ShVP6vfvFmhikqVeJdQoXuGlvL88mR8pKGt032h1WPpZMcMumm0GEnS+3YL2FpWqtt69T4iLafSXmKtttBnB9vKSlVhg73MaDjorVspLskd0vN6LQOhiGLXj9CDNXsY75xmFtWDVdq/AYQpEu6BVZq2DGivWkuPNkDXrwsHvXZdf50A+AOSff+MuTdefAAAAABJRU5ErkJggg==";
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
    }

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: WidgetChooseOption.label + "-" + Utils.generate_uuid(),
            help: "",
        };
        this.data = values?.data ?? {
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
        this.params.name = WidgetChooseOption.label + "-" + Utils.generate_uuid();
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
