/* global $ */
import combination from "./combination.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetMissingWordsItem extends WidgetItemElement {

    static widget = "MissingWordsItem";
    static type = "specific-element";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-missing-words-item";
    static paletteHidden = true;
    
    extensions = {
        validateQuestionBlankSpots: function (questionText) {
            if (!questionText || (questionText.length == 0))
                return false;

            var count = (questionText.match(/\[blank\]/g) || []).length;
            return (count == 1);
        }
    }

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { sentence: "", combinations: [] };
    }

    clone() {
        return new WidgetMissingWordsItem(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                sentence: this.data.sentence,
                preview: this.data.sentence.replace('[blank]', '____')
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.MissingWordsItem.label")
            };
        });
    }

    settingsClosed() {
        $("#f-" + this.id + " [name=question]").off('missingwords');
    }

    settingsOpened() {
        let $form = $("#f-" + this.id);
        let combinations = $.extend(true, [], this.data.combinations);
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

    preview() {
        return this.data?.sentence ? this.data.sentence : this.translate("widgets.MissingWordsItem.prev");
    }

    updateModelFromForm(form) {
        this.data.combinations = form.combination;
        this.data.sentence = form.sentence;
    }

    validateModel() {
        var errors = [];
        if (Utils.isStringEmptyOrWhitespace(this.data.sentence))
            errors.push("MissingWords.sentence.empty");
        if (!this.extensions.validateQuestionBlankSpots(this.data.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");
        if (!this.data.combinations.length)
            errors.push("MissingWords.combinations.empty");
        this.data.combinations.forEach(combination => {
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
