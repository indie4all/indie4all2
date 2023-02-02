import Utils from "../../../Utils.js"
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement.js";
import ModelManager from '../../ModelManager';

export default class WidgetAcordionContainer extends WidgetContainerElement {

    static widget = "AcordionContainer";
    static type = "specific-container";
    static label = "Acordion";
    static allow = ["AcordionContent"];
    static category = "containers";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAvCAYAAAB30kORAAAACXBIWXMAAAsSAAALEgHS3X78AAAC6klEQVRoBe2ZX2hSURzHv2rrjzp1sIpFXEcxIvtDDOL2ZzT3srX20ILt0kMroiFUL0qRWg8VPSi9rF72YEX1EJVF9dACIZi2l2wwerJYL+ZrwWZpL23e+Jkuo6v3er16bfiBC8q9556Ph3N+5/j7aVAAw3K7AAxCXeIAXiSiwfliFkvSDMuNAXBubFsLutTi7UwMOfEjiWjwfVENhuWuMCzHhyLveLVJfk/xB0cu8AzLzTEsZyklPXfn0YTqwnlIfN/gWRJ3CvlqGZazA7AMDXSrPJX/YDIa0Nu9m74fFrqvzX+gB+sJcwkfbV2ZSqQhrTSrVjZZPL6A3eML/BVFVkjph098BRJfFJfSdG0ted9iMtJmNwlg3uMLuPxexz1IkV44HUDmwZSCqgWY9Wh6dRGaHVaxJ2mk73p8gbjf6wiLSpOwzn8MujN9ygonf+Dn/kvIvJyBTlw6zwkAYUlzWruTqVTxX8x6aKxlHxfa8b9GD0kLcdH3HJquj8r2nEwjM/UBOpHFKIQkaXo56KoTGptLrWhI14qGdK0QDXnuDQt4ZslURce0CDxcncH2MtuJSpOwa3QYezpt8u2KcO7aOF4388pLEyRcDWm5qYrlOadNzQaM3X6CvZ3bFO04mUoj9ukz+n7/6y4LUWlbhzWb9cllfhTH1tGuvDTJ3rp+Hr0Hyh8RMfqPu7PvL3e9SJrT1cqJmIx6We2W50KksETxtBqZVJoawwP2stuJSj8ev4ynExG5XiUhYTk5REkj7RwdUtq3IhqnvFrRkK4V2lxRpmrbtFxCb6Zh0K8RbK1NRIMkHb564z6+pdJ1IUwhNjYbxyamTfB+PuS5YrPxyf4Rt+XU0UOyDjFKQIMWikxnpbdsZrCutUXwrYV1REqnUi3Rnk/0qcH61pascJEdOOz3OnqWNpdchfSk0JMeX4BX60cIITV6FK+c1pash1RpVx0I00y4CanSVDKgWnU+PKoA9d/j9zrU6r9CAPwCoOzP8QlLHz4AAAAASUVORK5CYII=";
    static cssClass = "widget-acordeon-container";

    constructor(values) {
        super(values);
        this.params = values?.params ?? {
            name: WidgetAcordionContainer.label + "-" + Utils.generate_uuid(),
            help: ""
        };
        this.data = values?.data ? values.data.map(elem => ModelManager.create(elem.widget, elem)) : [];
    }

    clone() {
        return new WidgetAcordionContainer(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            var data = {
                instanceId: this.id,
                instanceName: this.params.name,
                help: this.params.help
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.AcordionContainer.label")
            };
        });
    }

    preview() {
        return this.params?.name ?? this.translate("widgets.AcordionContainer.label");
    }

    regenerateIDs() {
        super.regenerateIDs();
        this.params.name = WidgetAcordionContainer.label + "-" + Utils.generate_uuid();
    }

    updateModelFromForm(form) {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel() {
        var keys = [];
        if (this.data.length == 0)
            keys.push("AcordionContainer.data.empty");
        if (!Utils.hasNameInParams(this))
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
