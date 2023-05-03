/* global $ */
import answer from "./answer.hbs"
import word from "./word.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetSpecificItemElement from "../WidgetSpecificItemElement/WidgetSpecificItemElement";
import icon from "./icon.png";
import { FormEditData, InputWidgetSentenceorderItemData, WidgetSentenceorderItemData } from "../../../types";

export default class WidgetSentenceOrderItem extends WidgetSpecificItemElement {

    static widget = "SentenceOrderItem";
    static icon = icon;

    private static validateAnswersWithWords(answers: string[], words: string[]): boolean {
        if (!answers.length || !words.length)
            return false;

        return answers.every(answer => {
            let tokens = answer.split(/\s+/);
            let myWords = [...words];
            for (let token of tokens) {
                let idx = myWords.indexOf(token);
                if (idx === -1) return false;
                myWords.splice(idx, 1);
            }
            return true;
        });
    }

    data: WidgetSentenceorderItemData;

    static async create(values?: InputWidgetSentenceorderItemData): Promise<WidgetSentenceOrderItem> {
        return new WidgetSentenceOrderItem(values);
    }

    constructor(values?: InputWidgetSentenceorderItemData) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { answers: [], words: [] };
    }

    clone(): WidgetSentenceOrderItem {
        const widget = new WidgetSentenceOrderItem();
        widget.data = structuredClone(this.data);
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = { instanceId: this.id };
        return {
            inputs: form(data),
            title: this.translate("widgets.SentenceOrderItem.label")
        };
    }

    getTexts() {
        return { "answers": this.data.answers, "words": this.data.words }
    }

    preview(): string {
        return this.data.answers.length ? this.data.answers[0] : this.translate("widgets.SentenceOrderItem.prev");
    }

    settingsClosed(): void {
        $("#f-" + this.id + " [name=question]").off('missingwords');
    }

    settingsOpened(): void {
        let $form = $("#f-" + this.id);
        let answers = <string[]>$.extend(true, [], this.data.answers);
        let words = <string[]>$.extend(true, [], this.data.words);
        let $answersContainer = $form.find('.answers');
        let $wordsContainer = $form.find('.words');

        answers.forEach((ans, idx) => $answersContainer.append(answer({ answer: ans, pos: idx })));
        words.forEach((wrd, idx) => $wordsContainer.append(word({ word: wrd, pos: idx })));
        $form.on('click.sentenceorder', '.btn-delete', function () {
            let $anchor = $(this).closest('.word, .answer');
            let cls = $anchor.hasClass('answer') ? '.answer' : '.word';
            let position = $form.find(cls).index($anchor);
            $anchor.remove();
            cls === '.answer' ? answers.splice(position, 1) : words.splice(position, 1);
            $form.find(cls + ' input').each(function () {
                let $item = $(this).closest(cls);
                let position = $form.find(cls).index($item);
                let $label = $(this).parent().find('label');
                $(this).attr('name', (<string>$(this).attr('name')).replace(/\[\d+\]/, "[" + position + "]"));
                $(this).attr('id', (<string>$(this).attr('id')).replace(/\[\d+\]/, "[" + position + "]"));
                $label.attr('for', (<string>$label.attr('for')).replace(/\[\d+\]/, "[" + position + "]"));
            });

            $form.find(cls + ' .btn-delete').each(function () {
                let $item = $(this).closest(cls);
                let position = $form.find(cls).index($item);
                let $label = $(this).parent().find('label');
                $(this).attr('id', (<string>$(this).attr('id')).replace(/-\d+/, "-" + position));
                $label.attr('for', (<string>$label.attr('for')).replace(/-\d+/, "-" + position));
            });
        });
        $form.on('click.sentenceorder', '.btn-add-word', function (e) {
            $wordsContainer.append(word({ word: "", pos: words.length }));
            words.push("")
        });

        $form.on('change.sentenceorder', 'input[name^="word"]', function () {
            let position = $form.find('input[name^="word"]').index($(this));
            words[position] = <string>$(this).val();
        });

        $form.on('click.sentenceorder', '.btn-add-answer', function (e) {
            $answersContainer.append(answer({ answer: "", pos: answers.length }));
            answers.push("")
        });

        $form.on('change.sentenceorder', 'input[name^="answer"]', function () {
            let position = $form.find('input[name^="answer"]').index($(this));
            answers[position] = <string>$(this).val();
        });

    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any) {
        this.data.answers = form.answer;
        this.data.words = form.word;
    }

    updateTexts(texts: any): void {
        this.data.answers = texts.answers;
        this.data.words = texts.words;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (!this.data.words.length)
            errors.push("SentenceOrderItem.words.empty");
        this.data.words.forEach(word => {
            Utils.isStringEmptyOrWhitespace(word) &&
                errors.push("SentenceOrderItem.words.invalid");
        });
        if (!this.data.answers.length)
            errors.push("SentenceOrderItem.answers.empty");
        this.data.answers.forEach(answer => {
            Utils.isStringEmptyOrWhitespace(answer) &&
                errors.push("SentenceOrderItem.answers.invalid");
        });
        if (this.data.answers.length && this.data.words.length) {
            if (!WidgetSentenceOrderItem.validateAnswersWithWords(this.data.answers, this.data.words))
                errors.push("SentenceOrderItem.answers.impossible");
        }
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        if (!form.word.length) errors.push("SentenceOrderItem.words.empty");
        form.word.forEach((word: string) => {
            Utils.isStringEmptyOrWhitespace(word) &&
                errors.push("SentenceOrderItem.words.invalid");
        });
        if (!form.answer.length) errors.push("SentenceOrderItem.words.empty");
        form.answer.forEach((answer: string) => {
            Utils.isStringEmptyOrWhitespace(answer) &&
                errors.push("SentenceOrderItem.answers.invalid");
        })
        if (form.answer.length && form.word.length) {
            if (!WidgetSentenceOrderItem.validateAnswersWithWords(form.answer, form.word))
                errors.push("SentenceOrderItem.answers.impossible");
        }
        return errors;
    }

}