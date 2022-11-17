indieauthor.widgets.TermClassificationItem = {
    widgetConfig: {
        widget: "TermClassificationItem",
        type: "specific-element",
        label: "column and Classification item",
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function (params) { },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function (options) {
        return '<div class="widget widget-column-classificacion-item" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="b1"><img src="' + this.icon + '" class="img-fluid drag-item"/></div><div class="b2" data-prev><span>{{translate "widgets.TermClassificationItem.prev"}}</span></div><div class="b3" data-toolbar> </div></div>';
    },
    getInputs: function (modelObject) {
        var templateValues = {
            instanceId: modelObject.id,
            column: modelObject.data.column,
            terms: modelObject.data.terms.length > 0 ? this.functions.reduceTerms(modelObject.data.terms) : ""
        }

        var template = '<form id="f-{{instanceId}}"><div class="form-group"><label for="column">{{translate "widgets.TermClassificationItem.form.column.label"}}</label><input type="text" class="form-control" name="column" required placeholder="{{translate "widgets.TermClassificationItem.form.column.placeholder"}}" value="{{column}}" autocomplete="off" /><small class="form-text text-muted">{{translate "widgets.TermClassificationItem.form.column.help"}}</small></div><label for="definition">{{translate "widgets.TermClassificationItem.form.terms.label"}}</label><textarea rows="4" class="form-control" name="terms" placeholder="{{translate "widgets.TermClassificationItem.form.terms.placeholder"}}" required>{{terms}}</textarea><small class="form-text text-muted">{{translate "widgets.TermClassificationItem.form.terms.help"}}</small></form>';
        var rendered = indieauthor.renderTemplate(template, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.TermClassificationItem.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) { },
    preview: function (modelObject) {
        const element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        let prev = indieauthor.strings.widgets.TermClassificationItem.prev;

        if (modelObject.data.column && modelObject.data.terms.length > 0) {
            const allWords = this.functions.reduceTerms(modelObject.data.terms);
            prev = `${modelObject.data.column} - ${allWords}`;
        }

        element.innerHTML = prev;
    },
    emptyData: function (options) {
        return {
            data: {
                column: "",
                terms: []
            }
        };
    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.data.column = formJson.column;
        modelObject.data.terms = this.functions.parseTerms(formJson.terms);
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (widgetInstance.data.column.length === 0) errors.push("TermClassificationItem.column.empty")

        if (widgetInstance.data.terms.length === 0) errors.push("TermClassificationItem.terms.empty")

        if (errors.length > 0)
            return {
                element: widgetInstance.id,
                keys: errors
            }

        return undefined;
    },
    validateForm: function (formData) {
        const keys = [];

        if (!this.functions.matchTerms(formData.terms)) keys.push("TermClassificationItem.terms.invalid");

        return keys;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAnFBMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///8eN1Z4h5qOm6pWaIBhc4nHzdX5DVz6KnDx8vTj5ur8hq39wtb9pMKqtL/8dqP7Z5lygpU5T2v3GGQ0Mlf/8PX+4ev+0eD6SYRPY3tHXHW4wMqcp7WAjqD7WI7UJ2iTKF5HL1d5YSg4AAAAEnRSTlMAQECA/jD34NBgELqmoJeAcDCW+Nc0AAABIElEQVRIx83U23KCMBCA4ZgCWnvOJoBBQLB46rl9/3drgGiQTtm90fG/ysU3TFhCWB0f7om5rgJACq739tZ7T8Rg8w+wmsObQFPBtN3Eq8BLgLc4FITOjNWh7voIz+Mmg0HZoLeOxg8Wq+fQBDUWNuitIynvLFbChGHpH+HZn9IuHpGf7LDbM47dNHC87wR4ETbRsFrGJqDg/pzTA84txue8/tZ6Q9vGqqi+MtoLbstZuaWNLttVxYo251zrdD0wjVg11VtNtc6R0YXtD7Epql1GnfNn+YN8FOQ8n/Pw41eBw/gl4zDaxWHSzW8xhxjHyls2mN14iwR5roIX2WJ2D1iesRazKTc9Rv9noMU2X6I5zCaYHTOXP0Gsz7qNBjPgFwmdi7gk6W/UAAAAAElFTkSuQmCC",
    functions: {
        /**
         * Parse a string with temrs separated with semicolon and returns an array of terms
         * 
         * @param terms {String} Semicolon separated terms
         * @returns {String[]} Array of terms
         */
        parseTerms: function (terms) {
            let termsArray = [];
            let termsCopy;

            if (this.matchTerms(terms)) {
                termsCopy = terms.endsWith(";") ? terms.slice(0, -1) : terms;
                termsArray = termsCopy.split(";").map(term => {
                    return term.trim().replace(/\s+/g, ' ');
                });

                termsArray = Array.from(new Set(termsArray));
            }

            return termsArray;
        },
        reduceTerms: function (terms) {
            return terms.map(t => t.trim()).reduce((pv, cv) => pv + ";" + cv);
        },
        matchTerms: function (terms) {
            const regex = /^[\w\s]+(;[\w\s]*)*$/;
            if (indieauthor.utils.isStringEmptyOrWhitespace(terms)) return false;
            return regex.test(terms);
        }
    }
}