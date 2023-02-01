/* global $ */
import answer from "./answer.hbs"
import form from "./form.hbs";
import word from "./word.hbs";
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetSentenceOrderItem extends WidgetItemElement {
    
    static widget = "SentenceOrderItem";
    static type = "specific-element";
    static label = "Sentence Order Item";
    static category = "interactiveElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAllBMVEUAAAB4h5oeN1YeN1Z4h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1b8hq39wtb6SYRWaIBhc4nx8vQqQmD5DVxygpX+4ev6KnCOm6r+0eD6OnpHXHXHzdW4wMqcp7WAjqDV2d9kdYo5T2uwucP/8PX9pML7Z5lPY3v5G2YnP13j5uqOsgN3AAAAEXRSTlMAQECAMPfg0GAQuqagl4BwMDhYLxIAAAEwSURBVEjHzdPtboIwFIDhykDnvg+HVltRNlBU9uXu/+aGtOSIZBwdifH9RZqHppRW7PO6exHUTYBMwW1t781KQ2c/OTrt4RLYkmBsF5ECn0bP4gmc0EWwjFwfENXN59L12sSRsuBTwczZhYwWqupN7fF0+FTjCKpkicGmJA1WOAwfzsGhfw4eWEzLmynbN635CB98uKx7p8EGbrVqPrTxhF6KMYeqHGMWa2NP4hKNZjFkaNYAa4MZ8BgSTLVOMQEG2zYYx7iB07DeIm41i10FYgF9ZubX3H83+H3m/2Dfs9FM06lrzczfbsL87SbM38F/4mu+3ccRToFPO+xhxuNkF1dY3JlCM/Mm+BVaLB6Ra1dah8XYK3ue/l0JHXb5IRthMeLsUFD+iLG+OGzQWQl+AeD7iqUwHFqjAAAAAElFTkSuQmCC";
    static cssClass = "widget-sentence-order-item";
    static paletteHidden = true;

    extensions = {
        validateAnswersWithWords: function (answers, words) {
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
    }

    constructor(values) {
        super(values);
        this.data = values?.data ?? { answers: [], words: [] };
    }

    clone() {
        return new WidgetSentenceOrderItem(this);
    }

    getInputs() {
        var data = { instanceId: this.id }
        return {
            inputs: form(data),
            title: this.translate("widgets.SentenceOrderItem.label")
        };
    }

    preview() {
        return this.data.answers.length ? this.data.answers[0] : this.translate("widgets.SentenceOrderItem.prev");
    }

    settingsClosed() {
        $("#f-" + this.id + " [name=question]").off('missingwords');
    }

    settingsOpened() {
        let $form = $("#f-" + this.id);
        let answers = $.extend(true, [], this.data.answers);
        let words = $.extend(true, [], this.data.words);
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
                $(this).attr('name', $(this).attr('name').replace(/\[\d+\]/, "[" + position + "]"));
                $(this).attr('id', $(this).attr('id').replace(/\[\d+\]/, "[" + position + "]"));
                $label.attr('for', $label.attr('for').replace(/\[\d+\]/, "[" + position + "]"));
            });
            
            $form.find(cls + ' .btn-delete').each(function () {
                let $item = $(this).closest(cls);
                let position = $form.find(cls).index($item);
                let $label = $(this).parent().find('label');
                $(this).attr('id', $(this).attr('id').replace(/-\d+/, "-" + position));
                $label.attr('for', $label.attr('for').replace(/-\d+/, "-" + position));
            });
        });
        $form.on('click.sentenceorder', '.btn-add-word', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $wordsContainer.append(word({ word: "", pos: words.length }));
            words.push("")
        });

        $form.on('change.sentenceorder', 'input[name^="word"]', function () {
            let position = $form.find('input[name^="word"]').index($(this));
            words[position] = $(this).val();
        });

        $form.on('click.sentenceorder', '.btn-add-answer', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $answersContainer.append(answer({ answer: "", pos: answers.length }));
            answers.push("")
        });

        $form.on('change.sentenceorder', 'input[name^="answer"]', function () {
            let position = $form.find('input[name^="answer"]').index($(this));
            answers[position] = $(this).val();
        });

    }

    updateModelFromForm(form) {
        this.data.answers = form.answer;
        this.data.words = form.word;
    }

    validateModel() {
        var errors = [];
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
            if (!this.extensions.validateAnswersWithWords(this.data.answers, this.data.words))
                errors.push("SentenceOrderItem.answers.impossible");
        }
        return errors;
    }

    validateForm(formData) {
        var errors = [];
        if (!formData.word.length) errors.push("SentenceOrderItem.words.empty");
        formData.word.forEach(word => {
            Utils.isStringEmptyOrWhitespace(word) &&
                errors.push("SentenceOrderItem.words.invalid");
        });
        if (!formData.answer.length) errors.push("SentenceOrderItem.words.empty");
        formData.answer.forEach(answer => {
            Utils.isStringEmptyOrWhitespace(answer) &&
                errors.push("SentenceOrderItem.answers.invalid");
        })
        if (formData.answer.length && formData.word.length) {
            if (!this.extensions.validateAnswersWithWords(formData.answer, formData.word))
                errors.push("SentenceOrderItem.answers.impossible");
        }
        return errors;
    }

}