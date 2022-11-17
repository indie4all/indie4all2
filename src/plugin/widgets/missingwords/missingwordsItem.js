indieauthor.widgets.MissingWordsItem = {
    widgetConfig: {
        widget: "MissingWordsItem",
        type: "specific-element",
        label: "Missing Words Item",
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
        return '<div class="widget widget-question" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item" /></div><div class="b2" data-prev><span>{{translate "widgets.MissingWordsItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            sentence: modelValues.data.sentence,
            preview: modelValues.data.sentence.replace('[blank]', '____')
        }
        var template = `
        <form id="f-{{instanceId}}">
            <div class="form-group">
              <label>{{translate "widgets.MissingWordsItem.form.sentence.label"}}</label>
              <input type="text" class="form-control" name="sentence" autocomplete="off" placeholder="{{translate "widgets.MissingWordsItem.form.sentence.placeholder"}}" required value="{{sentence}}" />
              <small class="form-text text-muted">{{translate "widgets.MissingWordsItem.form.sentence.help"}}</small>
            </div>
            <div class="form-group">
              <label>{{translate "widgets.MissingWordsItem.form.sentencePreview.label"}}</label>
              <input type="text" class="form-control" placeholder="{{translate "widgets.MissingWordsItem.form.sentencePreview.placeholder"}}" name="sentencePreview" readonly value="{{preview}}">
              <small class="form-text text-muted">{{translate "widgets.MissingWordsItem.form.sentencePreview.help"}}</small>
            </div>
            <div class="form-group">
              <button class="btn btn-block btn-indie btn-add-combination" type="button">{{translate "widgets.MissingWordsItem.form.combinations.new"}}</button>
            </div>
            <div class="combinations"></div>
        </form>`;
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.MissingWordsItem.label
        };
    },
    formCombinationTemplate: function (values) {
        let template = `
        <div class="form-row combination">
            <div class="form-group col-9 col-md-10">
                <label for="combination[{{pos}}]">{{translate "widgets.MissingWordsItem.form.combinations.text"}}</label>
                <input type="text" class="form-control" id="combination[{{pos}}]" name="combination[{{pos}}]" value="{{combination}}" required />
            </div>
            <div class="form-group col-3 col-md-auto">
                <label for="delete-combination-{{pos}}">{{translate "widgets.MissingWordsItem.form.combinations.delete"}} &nbsp;</label>
                <button class="btn btn-block btn-danger btn-delete" id="delete-combination-{{pos}}"><i class="fa fa-times"></i></button>
            </div>
        </div>`
        return indieauthor.renderTemplate(template, values)
    },
    settingsClosed: function (modelObject) {
        $("#f-" + modelObject.id + " [name=question]").off('missingwords');

    },
    settingsOpened: function (modelObject) {
        let $form = $("#f-" + modelObject.id);
        let combinations = $.extend(true, [], modelObject.data.combinations);
        let $combinationsContainer = $form.find('.combinations');
        combinations.forEach((comb, idx) => $combinationsContainer.append(indieauthor.widgets.MissingWordsItem.formCombinationTemplate({ combination: comb, pos: idx })));
        $form.on('keyup.missingwords', 'input[name="sentence"]', function () {
            let sentenceText = $(this).val();
            $form.find('[name=sentencePreview]').val(sentenceText.replace('[blank]', '____'));
        });

        $form.on('click.missingwords', '.btn-delete', function (e) {
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
                $(this).attr('id', $(this).attr('id').replace(/\-\d+/, "-" + position));
                $label.attr('for', $label.attr('for').replace(/\-\d+/, "-" + position));
            });
        });
        $form.on('click.missingwords', '.btn-add-combination', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $combinationsContainer.append(indieauthor.widgets.MissingWordsItem.formCombinationTemplate({ combination: "", pos: combinations.length }));
            combinations.push("");
        });

        $form.on('change.missingwords', 'input[name^="combination"]', function (e) {
            let position = $form.find('input[name^="combination"]').index($(this));
            combinations[position] = $(this).val();
        });
    },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.data.sentence ? modelObject.data.sentence : indieauthor.strings.widgets.MissingWordsItem.prev;
    },
    emptyData: function () {
        var object = {
            data: {
                sentence: "",
                combinations: []
            }
        };

        return object;
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.combinations = formJson.combination;
        modelObject.data.sentence = formJson.sentence;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (indieauthor.utils.isStringEmptyOrWhitespace(widgetInstance.data.sentence))
            errors.push("MissingWords.sentence.empty");

        if (!this.extensions.validateQuestionBlankSpots(widgetInstance.data.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");

        if (!widgetInstance.data.combinations.length)
            errors.push("MissingWords.combinations.empty");

        widgetInstance.data.combinations.forEach(combination => {
            indieauthor.utils.isStringEmptyOrWhitespace(combination) &&
                errors.push("MissingWords.combinations.invalid");
        })

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
        if (indieauthor.utils.isStringEmptyOrWhitespace(formData.sentence))
            errors.push("MissingWords.sentence.empty");

        if (!this.extensions.validateQuestionBlankSpots(formData.sentence))
            errors.push("MissingWords.sentence.onlyOneBlank");

        if (!formData.combination.length)
            errors.push("MissingWords.combinations.empty");

        formData.combination.forEach(combination => {
            indieauthor.utils.isStringEmptyOrWhitespace(combination) &&
                errors.push("MissingWords.combinations.invalid");
        })
        return errors;
    },
    extensions: {
        validateQuestionBlankSpots: function (questionText) {
            if (!questionText || (questionText.length == 0))
                return false;

            var count = (questionText.match(/\[blank\]/g) || []).length;
            return (count == 1);
        }
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAdVBMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///94h5oeN1ZWaIBhc4n8hq35DVzx8vT9wtaqtL+Om6qAjqD6SYRPY3tHXHX+4evj5urHzdW4wMqcp7X6KnCKJge2AAAAEnRSTlMAQECA/jD34NBgELqmoJeAcDCW+Nc0AAAAs0lEQVRIx+3U2w6CMAyA4To3QDxvBUXAs77/I4rQCTeuI/FCDf/Nbr4sTZoUngl3a2gbB8gUTKydyVumnZ1LJC3wqtmKIG6GOGq+DEWDE+3RT+I0XPbAxsz7YKP64NE/4I3t5IG3ZO87H0zv/mM4qSs7OE+aXNj2wt+/lAEP2GLPy09Y4IXHhTQ1hqnMM+bfAg+EYYFcsrKEIRZVq/R9xhC2KcPWYog4G0KbihiroNvIWQUekq6Fpx6q0IMAAAAASUVORK5CYII="
}
