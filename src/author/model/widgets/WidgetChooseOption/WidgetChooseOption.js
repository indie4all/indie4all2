/* global $ */
import form from "./form.hbs";
import palette from "./palette.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";

export default class WidgetChooseOption extends WidgetElement {
    config = {
        widget: "ChooseOption",
        type: "element",
        label: "Choose option",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAADPUlEQVRoBe2ZT0gUURzHvy5atOq6ghZCTVJUJARRyERF6kVyDTKQ0YtFBgvZZZcidwkz67BbINalYKM/dgizDl0s7OJulzJDAmsOdlmXoIOB/710mPgNO2YwM/ue7uzYsh9YnMU3bz4783u/35v38rAKQZQOAmiCvcQBvE6MDs4aWaxIC6LUB8C3vaIc9LGLj+MykuJnEqODXww1BFG6IYiSMhz7pNjN3MKicrLtqiKI0owgSm4z6ZlHA0O2C2uQ+NGmSyTu0/N1CKJUC8Dd3Fhjcyj/xVVUiPqaavp+Wu//Du2AGm4kSkx8HBvKlJGcdLrZvKnAHQhFagOhyD9ZJN/sOvL3OHr6+rXcmXaoHtCA6/ad0+3a7SqiYjcCYDYQivjDQe9TU+n5xSW0dNxUj9tbPaYDY618GP+GxwNvsKOiHO0tHrNe6E4/CYQi8XDQGzWUlienML+whId3rqD+RLUld9qHZjSc7cRwbCyVtAY9kmjKmLY6FbqKnDzNK5HLHhkkJ50pUkpT6rOS+cVl7t4NU96RQ1VwFRfi8q0HaG6ULcvT8mQc3X794mKEaUV8cf+6Kk0FwAqoIlLhYszRK5hKV+2pxNtnty0RXg//5UA0vdOYW4YyMcXWU4kTeQd2qoc0eGkawIKr2Kk+0bRJ/z52DUriF3NnBV/7kCeUqTPDV0Mx5vN6uzrA87pnGh48wiqJafXPj5/TXKfxts++mM5/7oMykWDriWL6+H71kPLuu9hnZon21gbmtkgl7Th1GKAPJzSweAcXD9kXHj13+9UyywKV/N6ui+pLA2WOl0NRZgkKJ54nYyrNW77lFo86ZyFhnpdhin8e6eybmlbtZf/1FB7aEjHPeUjOKHkwDY+1TpZoHcNoLSMd5F63MkVOOlM4kpsyli0yrpXh92ModG7RPduRGB0k6ShVP6vfvFmhikqVeJdQoXuGlvL88mR8pKGt032h1WPpZMcMumm0GEnS+3YL2FpWqtt69T4iLafSXmKtttBnB9vKSlVhg73MaDjorVspLskd0vN6LQOhiGLXj9CDNXsY75xmFtWDVdq/AYQpEu6BVZq2DGivWkuPNkDXrwsHvXZdf50A+AOSff+MuTdefAAAAABJRU5ErkJggg=="
    }

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

    createPaletteItem() {
        return {
            content: palette(this.config),
            numItems: 1
        }
    }

    createElement(widget) {

        return template({
            type: this.config.type,
            widget: this.config.widget,
            icon: this.config.icon,
            id: widget.id
        });
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            text: model.data.text,
            blob: model.data.blob,
            options: model.data.options,
            instanceName: model.params.name,
            help: model.params.help,
            alt: model.data.alt
        };

        return {
            inputs: form(data),
            title: this.translate("widgets.ChooseOption.label")
        };
    }

    settingsOpened(model) {
        const $form = $('#f-' + model.id);
        const $iImg = $form.find('input[name=image]');
        const $iBlob = $form.find('input[name=blob]');
        const $preview = $form.find('.img-preview');
        const $sectionPreview = $preview.closest('.form-group');
        $iImg.prop('required', !model.data.blob);
        $sectionPreview.toggleClass('d-none', !model.data.blob);

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

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        if (model.params.name && model.data.text)
            element.innerHTML = model.params.name + " | " + model.data.text;
        else
            element.innerHTML = this.translate("widgets.ChooseOption.prev");
        return element;
    }

    emptyData() {
        return {
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: "",
            },
            data: {
                text: "",
                blob: "",
                alt: "",
                options: [
                    {text: "", correct: false},
                    {text: "", correct: false},
                    {text: "", correct: false},
                    {text: "", correct: false}
                ]
            }
        };
    }

    updateModelFromForm(model, form) {
        var options = [];
        for (var i = 0; i < this.extensions.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({text: option, correct: parseInt(form.correct) == i })
            }
        }

        model.data.options = options;
        model.data.blob = form.blob;
        model.data.text = form.text;
        model.params.name = form.instanceName;
        model.params.help = form.help;
        model.data.alt = form.alt;
    }

    validateModel(widget) {
        var errors = [];
        if (widget.data.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (!Utils.isValidBase64DataUrl(widget.data.blob)) errors.push("common.imageblob.invalid");
        if (this.extensions.optionsWithoutCorrect(widget.data.options))
            errors.push("ChooseOption.options.noCorrect");
        if (widget.data.options.length != this.extensions.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (!Utils.hasNameInParams(widget))
            errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(widget.data.alt))
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
