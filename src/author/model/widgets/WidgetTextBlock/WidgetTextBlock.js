/* global $ */
import form from "./form.hbs";
import palette from "./palette.hbs";
import template from "./template.hbs";
import WidgetElement from "../WidgetElement/WidgetElement";
import RichTextEditorElement from "../mixings/RichTextEditorElement";

export default class WidgetTextBlock extends WidgetElement {

    constructor() {
        super();
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
    }
    
    config = {
        widget: "TextBlock",
        type: "element",
        label: "Text Block",
        category: "simpleElements",
        toolbar: { edit: true },
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAwCAYAAABuZUjcAAAACXBIWXMAAAsSAAALEgHS3X78AAACPElEQVRogWMYqoAR2d1y5mEFDAwM+QwMDAoD7J8NDAwMhY9OrnqASwHc4XLmYfMZGBgSkiK8GNztTOnmQnTw5PlrhrkrtzFcu/XgAwMDg+Ojk6su4FQsZx7mIGce9n/nwVP/BwP4+PnLf4/Ysv9y5mH7cbmZCUrHu9mbMrgNYEgjAz4ebobe2kyQCChAsSZbmMMVtFUHOlmjAi2Ee/A6fMiBUYfTG7AQY9/f9vUMf9vX0cxpbJ8W45SzM9fvlwlwAZXnEzsq0w7AxIlyOKOcCAOTrSaVnEkaYGNlMWBgYADhgIr2WYkdlWkLiHY4U7QtGA8C0M/AwAB2+FBL4wIV7bMcGEZLlQEAow6nNxj05TguMOjLcVxgqJXjcDCaOekNRh1ObzBajuMDoKKUZWsVFZyLAHQpxxl15cjWiwuMluP0BqMOpzcYdTi9wajD6Q1GHU5vMPQd/vHL14F1CRoAzQXhAzCHb1yz9SDDp0HkeJB72FhZGMREBLHKwxy+4NPnrx/Cs5oI+pQeYN7KbQz9c1Yz6Goo4bQNeboQNJQLmjI00FJTYODj4RoQR1+7/ZDh0+evYEfjcLgjaJwc3qyFzicagqYOr9164ICsUk5a3J6fl9sBmynUBqBJK3ERQQZuLg68JmO0xx+dXAUa9T+ALBbVPgs040wXhxMBQBO3RBeHG2AaBhg86KhMu0C0wzsq00BzMIUD7GhQwAXCOIz41aKCivZZoMnSBNq6DysAOXpBR2XaYIh1CgADAwMAv3EUkQX/fccAAAAASUVORK5CYII="
    }

    createElement(widget) {
        return template({
            type: this.config.type,
            widget: this.config.widget,
            icon: this.config.icon,
            prev: "widgets." + this.config.widget + ".prev",
            id: widget.id
            
        });
    }

    createPaletteItem() {
        return {
            content: palette({
                category: this.config.category,
                type: this.config.type,
                widget: this.config.widget,
                icon: this.config.icon,
                label: "widgets." + this.config.widget + ".label"
            }),
            numItems: 1
        }
    }

    emptyData() {
        return { data: { text: "" } };
    }

    getInputs(model) {
        const data = {
            instanceId: model.id,
            label: "widgets." + this.config.widget + ".form.label",
            help: "widgets." + this.config.widget + ".form.help"
        }

        return {
            inputs: form(data),
            title: this.translate("widgets.TextBlock.label")
        };
    }

    settingsOpened(model) {
        var editorElement = $('#f-' + model.id + ' .texteditor');
        this.initTextEditor(model.data.text, editorElement);
    }

    preview(model) {
        const element = document.querySelector('[data-id="' + model.id + '"]').querySelector('[data-prev]');
        element.innerHTML = model.data.text.length > 0 ? model.data.text : this.translate("widgets.TextBlock.prev");
        return element;
    }

    updateModelFromForm(model, form) {
        model.data.text = this.clearAndSanitizeHtml(form.textblockText);
    }

    validateModel(widget) {
        if (widget.data.text.length == 0 || this.isEmptyText(widget.data.text))
            return ["TextBlock.text.invalid"];
        return [];
    }

    validateForm(form) {
        if (form.textblockText.length == 0 || this.isEmptyText(form.textblockText))
            return ["TextBlock.text.invalid"];
        return [];
    }
}