/* global $ */
import combination from "./combination.hbs";
import form from "./form.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import Utils from "../../../Utils";

export default class WidgetMissingWordsItem extends WidgetElement {
    
    config = {
        widget: "MissingWordsItem",
        type: "specific-element",
        label: "Missing Words Item",
        category: "interactiveElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAdVBMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1ZWaIBhc4n8hq35DVzx8vT9wtaqtL+Om6qAjqD6SYRPY3tHXHX+4evj5urHzdW4wMqcp7X6KnCKJge2AAAAEnRSTlMAQECA/jD34NBgELqmoJeAcDCW+Nc0AAAAs0lEQVRIx+3U2w6CMAyA4To3QDxvBUXAs77/I4rQCTeuI/FCDf/Nbr4sTZoUngl3a2gbB8gUTKydyVumnZ1LJC3wqtmKIG6GOGq+DEWDE+3RT+I0XPbAxsz7YKP64NE/4I3t5IG3ZO87H0zv/mM4qSs7OE+aXNj2wt+/lAEP2GLPy09Y4IXHhTQ1hqnMM+bfAg+EYYFcsrKEIRZVq/R9xhC2KcPWYog4G0KbihiroNvIWQUekq6Fpx6q0IMAAAAASUVORK5CYII="
    }

    extensions = {
        validateQuestionBlankSpots: function (questionText) {
            if (!questionText || (questionText.length == 0))
                return false;

            var count = (questionText.match(/\[blank\]/g) || []).length;
            return (count == 1);
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

    emptyData() {
        return { data: { sentence: "", combinations: [] } };
    }

    getInputs(model) {
        const data = {
            instanceId: model.id,
            sentence: model.data.sentence,
            preview: model.data.sentence.replace('[blank]', '____')
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.MissingWordsItem.label")
        };
    }

    settingsClosed(model) {
        $("#f-" + model.id + " [name=question]").off('missingwords');
    }

    settingsOpened(model) {
        let $form = $("#f-" + model.id);
        let combinations = $.extend(true, [], model.data.combinations);
        let $combinationsContainer = $form.find('.combinations');
        combinations.forEach((comb, idx) => $combinationsContainer.append(combination({ combination: comb, pos: idx })));
        $form.on('keyup.missingwords', 'input[name="sentence"]', function () {
            let sentenceText = $(this).val();
            $form.find('[name=sentencePreview]').val(sentenceText.replace('[blank]', '____'));
        });

        $form.on('click.missingwords', '.btn-delete', function () {
            let $combination = $(this).closest('.combination');
            let position = $form.find('.combination').index($combination);
            combinations.splice(position, 1);
            $combination.remove();
            $form.find('.combination input').each(function () {
                let $combination = $(this).closest('.combination');
                let position = $form.find('.combination').index($combination);
                let $label = $(this).parent().find('label');
                $(this).attr('name', $(this).attr('name').replace(/\[\d+\]/, "[" + position + "]"));
                $(this).attr('id', $(this).attr('id').replace(/\[\d+\]/, "[" + position + "]"));
                $label.attr('for', $label.attr('for').replace(/\[\d+\]/, "[" + position + "]"));
            });
            $form.find('.combination .btn-delete').each(function () {
                let $combination = $(this).closest('.combination');
                let position = $form.find('.combination').index($combination);
                let $label = $(this).parent().find('label');
                $(this).attr('id', $(this).attr('id').replace(/-\d+/, "-" + position));
                $label.attr('for', $label.attr('for').replace(/-\d+/, "-" + position));
            });
        });
        $form.on('click.missingwords', '.btn-add-combination', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $combinationsContainer.append(combination({ combination: "", pos: combinations.length }));
            combinations.push("");
        });

        $form.on('change.missingwords', 'input[name^="combination"]', function () {
            let position = $form.find('input[name^="combination"]').index($(this));
            combinations[position] = $(this).val();
        });
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.innerHTML = model.data.sentence ? model.data.sentence : this.translate("widgets.MissingWordsItem.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        model.data.combinations = form.combination;
        model.data.sentence = form.sentence;
    }

    validateModel(widget) {
        var errors = [];
        if (Utils.isStringEmptyOrWhitespace(widget.data.sentence))
            errors.push("MissingWords.sentence.empty");
        if (!this.extensions.validateQuestionBlankSpots(widget.data.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");
        if (!widget.data.combinations.length)
            errors.push("MissingWords.combinations.empty");
        widget.data.combinations.forEach(combination => {
            Utils.isStringEmptyOrWhitespace(combination) &&
                errors.push("MissingWords.combinations.invalid");
        });
        return errors;
    }

    validateForm(form) {
        var errors = [];
        if (Utils.isStringEmptyOrWhitespace(form.sentence))
            errors.push("MissingWords.sentence.empty");
        if (!this.extensions.validateQuestionBlankSpots(form.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");
        if (!form.combination.length)
            errors.push("MissingWords.combinations.empty");
        form.combination.forEach(combination => {
            Utils.isStringEmptyOrWhitespace(combination) &&
                errors.push("MissingWords.combinations.invalid");
        })
        return errors;
    }
    
}
