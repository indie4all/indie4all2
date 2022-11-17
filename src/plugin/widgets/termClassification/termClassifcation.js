indieauthor.widgets.TermClassification = {
    widgetConfig: {
        widget: "TermClassification",
        type: "specific-element-container",
        label: "Terms and Classification",
        allow: ["TermClassificationItem"],
        category: "interactiveElements",
        toolbar: {
            edit: true
        }
    },
    createPaletteItem: function () {
        var item = {};
        item.content = indieauthor.renderTemplate(`<div class="palette-item" data-category="{{category}}" data-type="{{type}}" data-widget="{{widget}}">  <img src="${this.icon}" class="img-fluid"/> <br/> <span> {{translate "widgets.TermClassification.label"}}</span></div>`, this.widgetConfig);
        item.numItems = 1;
        return item;
    },
    createElement: function (widgetInfo) {
        return indieauthor.renderTemplate(this.template(), {
            type: this.widgetConfig.type,
            widget: this.widgetConfig.widget,
            id: widgetInfo.id
        });
    },
    template: function () {
        return '<div class="widget-TermClassification" data-type="{{type}}" data-widget="{{widget}}" data-id="{{id}}"><div class="widget"><div class="b1"> <img src="' + this.icon + '" class="img-fluid drag-item" /> </div><div class="b2" data-prev><span>{{translate "widgets.TermClassification.prev"}}</span></div><div class="b3" data-toolbar> </div></div><div data-widget="{{widget}}" data-type="{{type}}" class="element-container dragula-container" data-content></div></div>';
    },
    getInputs: function (modelValues) {
        var templateValues = {
            instanceId: modelValues.id,
            image: modelValues.data.image,
            instanceName: modelValues.params.name,
            help: modelValues.params.help,
            alt: modelValues.data.alt
        }

        var inputTemplate = '<form id="f-{{instanceId}}"><div class="form-group"> <label for="instanceName">{{translate "common.name.label"}}</label> <input type="text" name="instanceName" class="form-control" value="{{instanceName}}" placeholder="{{translate "common.name.placeholder"}}" autocomplete="off" required/> <small class="form-text text-muted">{{translate "common.name.help"}}</small> </div><div class="form-group"> <label for="help">{{translate "common.help.label"}}</label> <div class="input-group mb-3"> <input name="help" type="text" class="form-control" placeholder="{{translate "common.help.placeholder"}}" value="{{help}}"> <div class="input-group-append"> <button class="btn btn-indie" type="button" onclick="$(\'input[name=help]\').val(\'\')">{{translate "common.help.button"}}</button> </div></div><small class="form-text text-muted">{{translate "common.help.help"}}</small> </div><div class="form-group"><label for="image">{{translate "widgets.TermClassification.form.image.label"}}</label></form>';
        var rendered = indieauthor.renderTemplate(inputTemplate, templateValues);

        return {
            inputs: rendered,
            title: indieauthor.strings.widgets.TermClassification.label
        };
    },
    settingsClosed: function (modelObject) { },
    settingsOpened: function (modelObject) { },
    preview: function (modelObject) {
        var element = document.querySelector('[data-id="' + modelObject.id + '"]').querySelector('[data-prev]');
        element.innerHTML = modelObject.params.name ? modelObject.params.name : indieauthor.strings.widgets.TermClassification.prev;
    },
    emptyData: function (options) {
        return {
            params: {
                name: `${this.widgetConfig.label}-${indieauthor.utils.generate_uuid()}`,
                help: ""
            },
            data: []
        };

    },
    updateModelFromForm: function (modelObject, formJson) {
        modelObject.params.name = formJson.instanceName;
        modelObject.params.help = formJson.help;
    },
    validateModel: function (widgetInstance) {
        var errors = [];

        if (!indieauthor.utils.hasNameInParams(widgetInstance))
            errors.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(widgetInstance.params.name, widgetInstance.id))
            errors.push("common.name.notUniqueName");

        const duplicatedcolumns = this.functions.getDuplicatedColumn(widgetInstance.data);
        if (duplicatedcolumns.length > 0) errors.push("TermClassification.data.duplicatedColumn")
        
        const duplicatedTermsBetweenColumns = this.functions.getDuplicatedTerms(widgetInstance.data);
        if (duplicatedTermsBetweenColumns.length > 0) errors.push("TermClassification.data.duplicatedTerms")

        if (errors.length > 0) {
            return {
                element: widgetInstance.id,
                keys: errors
            }
        }

        return undefined;
    },
    validateForm: function (formData, instanceId) {
        var errors = [];

        if (formData.instanceName.length == 0)
            errors.push("common.name.invalid");
        else if (!indieauthor.model.isUniqueName(formData.instanceName, instanceId))
            errors.push("common.name.notUniqueName");

        return errors;
    },
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAvCAMAAACvztidAAAAnFBMVEUAAAB4h5oeN1YeN1YoQF54h5okPFt4h5p4h5oeN1YeN1YqQl8mPlx4h5opQF54h5pEWXMeN1b///8eN1Z4h5qOm6pWaIBhc4nHzdX5DVz6KnDx8vTj5ur8hq39wtb9pMKqtL/8dqP7Z5lygpU5T2v3GGQ0Mlf/8PX+4ev+0eD6SYRPY3tHXHW4wMqcp7WAjqD7WI7UJ2iTKF5HL1d5YSg4AAAAEnRSTlMAQECA/jD34NBgELqmoJeAcDCW+Nc0AAABIElEQVRIx83U23KCMBCA4ZgCWnvOJoBBQLB46rl9/3drgGiQTtm90fG/ysU3TFhCWB0f7om5rgJACq739tZ7T8Rg8w+wmsObQFPBtN3Eq8BLgLc4FITOjNWh7voIz+Mmg0HZoLeOxg8Wq+fQBDUWNuitIynvLFbChGHpH+HZn9IuHpGf7LDbM47dNHC87wR4ETbRsFrGJqDg/pzTA84txue8/tZ6Q9vGqqi+MtoLbstZuaWNLttVxYo251zrdD0wjVg11VtNtc6R0YXtD7Epql1GnfNn+YN8FOQ8n/Pw41eBw/gl4zDaxWHSzW8xhxjHyls2mN14iwR5roIX2WJ2D1iesRazKTc9Rv9noMU2X6I5zCaYHTOXP0Gsz7qNBjPgFwmdi7gk6W/UAAAAAElFTkSuQmCC",
    functions: {
        /**
         * 
         * @param {any[]} items TermClassificatonItem item array 
         * @returns {string[]} duplicated columns
         */
        getDuplicatedColumn: function (items) {
            if (items && items.length > 0) {
                const repeatedColumns = items.map(item => item.data.column).filter((item, pos, self) => self.indexOf(item) !== pos);
                const uniqueColumnsSet = new Set(repeatedColumns);
                return Array.from(uniqueColumnsSet);
            }

            return [];
        },
        /**
         * 
         * @param {any[]} items TermClassificatonItem item array 
         * @returns {string[]} duplicated terms
         */
        getDuplicatedTerms: function (items) {
            if (items && items.length > 0) {
                const allTerms = items.reduce((prev, curr) => prev.concat(curr.data.terms), []);
                const duplicatedTerms = allTerms.filter((item, pos, self) => self.indexOf(item) !== pos);
                const uniqueTerms = new Set(duplicatedTerms);
                return Array.from(uniqueTerms);
            }

            return [];
        }
    }
}