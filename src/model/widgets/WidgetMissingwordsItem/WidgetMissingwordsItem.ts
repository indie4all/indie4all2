/* global $ */
import combination from "./combination.hbs";
import Utils from "../../../Utils";
import './styles.scss';
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetMissingwordsItemData, WidgetMissingwordsItemData } from "../../../types";

export default class WidgetMissingWordsItem extends WidgetSpecificItemElement {

    static widget = "MissingWordsItem";
    static icon = icon;

    private static validateQuestionBlankSpots(questionText: string) {
        if (!questionText || (questionText.length == 0))
            return false;

        var count = (questionText.match(/\[blank\]/g) || []).length;
        return (count == 1);
    }

    data: WidgetMissingwordsItemData;

    static async create(values?: InputWidgetMissingwordsItemData): Promise<WidgetMissingWordsItem> {
        return new WidgetMissingWordsItem(values);
    }

    constructor(values?: InputWidgetMissingwordsItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { sentence: "", combinations: [] };
    }

    clone(): WidgetMissingWordsItem {
        const widget = new WidgetMissingWordsItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            sentence: this.data.sentence,
            preview: this.data.sentence.replace('[blank]', '____')
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.MissingWordsItem.label")
        };
    }

    getTexts() {
        return { "sentence": this.data.sentence, "combinations": this.data.combinations }
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    settingsClosed(): void {
        $("#f-" + this.id + " [name=question]").off('missingwords');
    }

    settingsOpened(): void {
        let $form = $("#f-" + this.id);
        let combinations = <string[]>$.extend(true, [], this.data.combinations);
        let $combinationsContainer = $form.find('.combinations');
        combinations.forEach((comb, idx) => $combinationsContainer.append(combination({ combination: comb, pos: idx })));
        $form.on('keyup.missingwords', 'input[name="sentence"]', function () {
            let sentenceText = <string>$(this).val();
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
                $(this).attr('name', (<string>$(this).attr('name')).replace(/\[\d+\]/, "[" + position + "]"));
                $(this).attr('id', (<string>$(this).attr('id')).replace(/\[\d+\]/, "[" + position + "]"));
                $label.attr('for', (<string>$label.attr('for')).replace(/\[\d+\]/, "[" + position + "]"));
            });
            $form.find('.combination .btn-delete').each(function () {
                let $combination = $(this).closest('.combination');
                let position = $form.find('.combination').index($combination);
                let $label = $(this).parent().find('label');
                $(this).attr('id', (<string>$(this).attr('id')).replace(/-\d+/, "-" + position));
                $label.attr('for', (<string>$label.attr('for')).replace(/-\d+/, "-" + position));
            });
        });
        $form.on('click.missingwords', '.btn-add-combination', function (e) {
            $combinationsContainer.append(combination({ combination: "", pos: combinations.length }));
            combinations.push("");
        });

        $form.on('change.missingwords', 'input[name^="combination"]', function () {
            let position = $form.find('input[name^="combination"]').index($(this));
            combinations[position] = <string>$(this).val();
        });
    }

    preview(): string {
        return this.data?.sentence ? this.data.sentence : this.translate("widgets.MissingWordsItem.prev");
    }

    updateModelFromForm(form: any): void {
        this.data.combinations = form.combination;
        this.data.sentence = form.sentence;
    }

    updateTexts(texts: any): void {
        this.data.sentence = texts.sentence;
        this.data.combinations = texts.combinations;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(this.data.sentence))
            errors.push("MissingWords.sentence.empty");
        if (!WidgetMissingWordsItem.validateQuestionBlankSpots(this.data.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");
        if (!this.data.combinations.length)
            errors.push("MissingWords.combinations.empty");
        this.data.combinations.forEach(combination => {
            Utils.isStringEmptyOrWhitespace(combination) &&
                errors.push("MissingWords.combinations.invalid");
        });
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (Utils.isStringEmptyOrWhitespace(form.sentence))
            errors.push("MissingWords.sentence.empty");
        if (!WidgetMissingWordsItem.validateQuestionBlankSpots(form.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");
        if (!form.combination.length)
            errors.push("MissingWords.combinations.empty");
        form.combination.forEach((combination: string) => {
            Utils.isStringEmptyOrWhitespace(combination) &&
                errors.push("MissingWords.combinations.invalid");
        })
        return errors;
    }

}
