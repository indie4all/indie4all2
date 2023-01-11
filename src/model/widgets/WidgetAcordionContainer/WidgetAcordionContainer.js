import form from './form.hbs'
import Utils from "../../../Utils.js"
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement.js";

export default class WidgetAcordionContainer extends WidgetContainerElement {

    config = {
        widget: "AcordionContainer",
        type: "specific-container",
        label: "Acordion",
        allow: ["AcordionContent"],
        category: "containers",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC6klEQVRoBe2ZX2hSURzHv2rrjzp1sIpFXEcxIvtDDOL2ZzT3srX20ILt0kMroiFUL0qRWg8VPSi9rF72YEX1EJVF9dACIZi2l2wwerJYL+ZrwWZpL23e+Jkuo6v3er16bfiBC8q9556Ph3N+5/j7aVAAw3K7AAxCXeIAXiSiwfliFkvSDMuNAXBubFsLutTi7UwMOfEjiWjwfVENhuWuMCzHhyLveLVJfk/xB0cu8AzLzTEsZyklPXfn0YTqwnlIfN/gWRJ3CvlqGZazA7AMDXSrPJX/YDIa0Nu9m74fFrqvzX+gB+sJcwkfbV2ZSqQhrTSrVjZZPL6A3eML/BVFVkjph098BRJfFJfSdG0ted9iMtJmNwlg3uMLuPxexz1IkV44HUDmwZSCqgWY9Wh6dRGaHVaxJ2mk73p8gbjf6wiLSpOwzn8MujN9ygonf+Dn/kvIvJyBTlw6zwkAYUlzWruTqVTxX8x6aKxlHxfa8b9GD0kLcdH3HJquj8r2nEwjM/UBOpHFKIQkaXo56KoTGptLrWhI14qGdK0QDXnuDQt4ZslURce0CDxcncH2MtuJSpOwa3QYezpt8u2KcO7aOF4388pLEyRcDWm5qYrlOadNzQaM3X6CvZ3bFO04mUoj9ukz+n7/6y4LUWlbhzWb9cllfhTH1tGuvDTJ3rp+Hr0Hyh8RMfqPu7PvL3e9SJrT1cqJmIx6We2W50KksETxtBqZVJoawwP2stuJSj8ev4ynExG5XiUhYTk5REkj7RwdUtq3IhqnvFrRkK4V2lxRpmrbtFxCb6Zh0K8RbK1NRIMkHb564z6+pdJ1IUwhNjYbxyamTfB+PuS5YrPxyf4Rt+XU0UOyDjFKQIMWikxnpbdsZrCutUXwrYV1REqnUi3Rnk/0qcH61pascJEdOOz3OnqWNpdchfSk0JMeX4BX60cIITV6FK+c1pash1RpVx0I00y4CanSVDKgWnU+PKoA9d/j9zrU6r9CAPwCoOzP8QlLHz4AAAAASUVORK5CYII=",
        cssClass: "widget-acordeon-container"
    }


    emptyData(id) {
        return {
            id: id ?? Utils.generate_uuid(),
            type: this.config.type,
            widget: this.config.widget,
            params: {
                name: this.config.label + "-" + Utils.generate_uuid(),
                help: ""
            },
            data: []
        };
    }

    getInputs(model) {
        var data = {
            instanceId: model.id,
            instanceName: model.params.name,
            help: model.params.help
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.AcordionContainer.label")
        };
    }

    preview(model) {
        return model.params?.name ?? this.translate("widgets.AcordionContainer.label");
    }

    updateModelFromForm(model, form) {
        model.params.name = form.instanceName;
        model.params.help = form.help;
    }

    validateModel(model) {
        var keys = [];
        if (model.data.length == 0)
            keys.push("AcordionContainer.data.empty");
        if (!Utils.hasNameInParams(model))
            keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form) {
        var keys = [];
        if (form.instanceName.length == 0)
            keys.push("common.name.invalid");
        return keys;
    }
}
