indieauthor.widgets.SentenceOrderItem = {
    widgetConfig: {
        widget: "SentenceOrderItem",
        type: "specific-element",
        label: "Sentence Order Item",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) { },
    createElement: function (widgetInfo) {
        var element = indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
        return element;
    },
    template: function (options) {
        return '<div class="widget widget-question" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item" /></div><div class="b2" data-prev><span>{{translate "widgets.SentenceOrderItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
        }
        var template = `
        <form id="f-{{instanceId}}">
            <fieldset>
              <legend class="text-center">{{translate "widgets.SentenceOrderItem.form.words.legend"}}</legend>
              <div class="form-row">
                <button class="btn btn-block btn-indie btn-add-word" type="button">{{translate "widgets.SentenceOrderItem.form.words.new"}}</button>
                <small class="form-text text-muted mb-4">{{translate "widgets.SentenceOrderItem.form.words.help"}}</small>
              </div>
              <div class="form-row words">
              </div>
            </fieldset>
            <fieldset class="answers">
              <legend class="text-center">{{translate "widgets.SentenceOrderItem.form.answers.legend"}}</legend>
              <div class="form-row">
                <button class="btn btn-block btn-indie btn-add-answer" type="button">{{translate "widgets.SentenceOrderItem.form.answers.new"}}</button>
                <small class="form-text text-muted mb-4">{{translate "widgets.SentenceOrderItem.form.words.help"}}</small>
              </div>
            </fieldset>
        </form>`;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.SentenceOrderItem.label
        };
    },
    formAnswerTemplate: function (values) {
        let template = `
        <div class="form-row answer">
            <div class="form-group col-9 col-md-10">
                <label for="answer[{{pos}}]">{{translate "widgets.SentenceOrderItem.form.answers.text"}}</label>
                <input type="text" class="form-control" id="answer[{{pos}}]" name="answer[{{pos}}]" value="{{answer}}" required />
            </div>
            <div class="form-group col-3 col-md-auto">
                <label for="delete-answer-{{pos}}">{{translate "widgets.SentenceOrderItem.form.answers.delete"}} &nbsp;</label>
                <button class="btn btn-block btn-danger btn-delete" id="delete-answer-{{pos}}"><i class="fa fa-times"></i></button>
            </div>
        </div>`
        return indieauthor.renderTemplate(template, values)
    },
    formWordTemplate: function (values) {
        let template = `
        <div class="form-group col-12 col-sm-6 col-lg-4 word">
            <div class="form-row">
                <div class="col-9">
                    <label for="word[{{pos}}]">{{translate "widgets.SentenceOrderItem.form.words.text"}}</label>
                    <input type="text" class="form-control" id="word[{{pos}}]" name="word[{{pos}}]" value="{{word}}" required />
                </div>
                <div class="col-3">
                    <label for="delete-word-{{pos}}">{{translate "widgets.SentenceOrderItem.form.words.delete"}} &nbsp;</label>
                    <button class="btn btn-block btn-danger btn-delete" id="delete-word-{{pos}}"><i class="fa fa-times"></i></button>
                </div>
            </div>
        </div>`
        return indieauthor.renderTemplate(template, values)
    },
    settingsClosed: function (modelObject) {
        $("#f-" + modelObject.id + " [name=question]").off('missingwords');

    },
    settingsOpened: function (modelObject) {
        let $form = $("#f-" + modelObject.id);
        let answers = $.extend(true, [], modelObject.data.answers);
        let words = $.extend(true, [], modelObject.data.words);
        let $answersContainer = $form.find('.answers');
        let $wordsContainer = $form.find('.words');
        
        answers.forEach((ans, idx) => $answersContainer.append(indieauthor.widgets.SentenceOrderItem.formAnswerTemplate({ answer: ans, pos: idx })));
        words.forEach((wrd, idx) => $wordsContainer.append(indieauthor.widgets.SentenceOrderItem.formWordTemplate({ word: wrd, pos: idx })));
        $form.on('click.sentenceorder', '.btn-delete', function (e) {
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
                $(this).attr('id', $(this).attr('id').replace(/\-\d+/, "-" + position));
                $label.attr('for', $label.attr('for').replace(/\-\d+/, "-" + position));
            });
        });
        $form.on('click.sentenceorder', '.btn-add-word', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $wordsContainer.append(indieauthor.widgets.SentenceOrderItem.formWordTemplate({ word: "", pos: words.length }));
            words.push("")
        });

        $form.on('change.sentenceorder', 'input[name^="word"]', function (e) {
            let position = $form.find('input[name^="word"]').index($(this));
            words[position] = $(this).val();
        });

        $form.on('click.sentenceorder', '.btn-add-answer', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $answersContainer.append(indieauthor.widgets.SentenceOrderItem.formAnswerTemplate({ answer: "", pos: answers.length }));
            answers.push("")
        });

        $form.on('change.sentenceorder', 'input[name^="answer"]', function (e) {
            let position = $form.find('input[name^="answer"]').index($(this));
            answers[position] = $(this).val();
        });

    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.data.answers.length ? modelObject.data.answers[0] : indieauthor.strings.widgets.SentenceOrderItem.prev;
    },
    emptyData: function () {
        var object = {
            data: {
                answers: [],
                words: []
            }
        };

        return object;
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.answers = formJson.answer;
        modelObject.data.words = formJson.word;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (!widgetInstance.data.words.length)
            errors.push("SentenceOrderItem.words.empty");

        widgetInstance.data.words.forEach(word => {
            indieauthor.utils.isStringEmptyOrWhitespace(word) &&
                errors.push("SentenceOrderItem.words.invalid");
        });
        
        if (!widgetInstance.data.answers.length)
            errors.push("SentenceOrderItem.answers.empty");

        widgetInstance.data.answers.forEach(answer => {
            indieauthor.utils.isStringEmptyOrWhitespace(answer) &&
                errors.push("SentenceOrderItem.answers.invalid");
        });

        if (widgetInstance.data.answers.length && widgetInstance.data.words.length) {
            if (!this.extensions.validateAnswersWithWords(widgetInstance.data.answers, widgetInstance.data.words))
                errors.push("SentenceOrderItem.answers.impossible");
        }

        if (errors.length > 0) {
            return {
                element: widgetInstance.id,
                keys: errors
            }
        }

        return undefined;
    },
    validateForm: function (formData) {
        var errors = [];

        if (!formData.word.length)
            errors.push("SentenceOrderItem.words.empty");

        formData.word.forEach(word => {
            indieauthor.utils.isStringEmptyOrWhitespace(word) &&
                errors.push("SentenceOrderItem.words.invalid");
        })

        if (!formData.answer.length)
            errors.push("SentenceOrderItem.words.empty");

        formData.answer.forEach(answer => {
            indieauthor.utils.isStringEmptyOrWhitespace(answer) &&
                errors.push("SentenceOrderItem.answers.invalid");
        })

        if (formData.answer.length && formData.word.length) {
            if (!this.extensions.validateAnswersWithWords(formData.answer, formData.word))
                errors.push("SentenceOrderItem.answers.impossible");
        }

        return errors;
    },
    extensions: {
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
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAllBMVEUAAAB4h5oeN1YeN1Z4h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1b8hq39wtb6SYRWaIBhc4nx8vQqQmD5DVxygpX+4ev6KnCOm6r+0eD6OnpHXHXHzdW4wMqcp7WAjqDV2d9kdYo5T2uwucP/8PX9pML7Z5lPY3v5G2YnP13j5uqOsgN3AAAAEXRSTlMAQECAMPfg0GAQuqagl4BwMDhYLxIAAAEwSURBVEjHzdPtboIwFIDhykDnvg+HVltRNlBU9uXu/+aGtOSIZBwdifH9RZqHppRW7PO6exHUTYBMwW1t781KQ2c/OTrt4RLYkmBsF5ECn0bP4gmc0EWwjFwfENXN59L12sSRsuBTwczZhYwWqupN7fF0+FTjCKpkicGmJA1WOAwfzsGhfw4eWEzLmynbN635CB98uKx7p8EGbrVqPrTxhF6KMYeqHGMWa2NP4hKNZjFkaNYAa4MZ8BgSTLVOMQEG2zYYx7iB07DeIm41i10FYgF9ZubX3H83+H3m/2Dfs9FM06lrzczfbsL87SbM38F/4mu+3ccRToFPO+xhxuNkF1dY3JlCM/Mm+BVaLB6Ra1dah8XYK3ue/l0JHXb5IRthMeLsUFD+iLG+OGzQWQl+AeD7iqUwHFqjAAAAAElFTkSuQmCC"
}
