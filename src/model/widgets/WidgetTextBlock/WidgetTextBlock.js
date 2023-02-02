/* global $ */
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";

export default class WidgetTextBlock extends WidgetItemElement {

    static widget = "TextBlock";
    static type = "element";
    static label = "Text Block";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAwCAYAAABuZUjcAAAACXBIWXMAAAsSAAALEgHS3X78AAACPElEQVRogWMYqoAR2d1y5mEFDAwM+QwMDAoD7J8NDAwMhY9OrnqASwHc4XLmYfMZGBgSkiK8GNztTOnmQnTw5PlrhrkrtzFcu/XgAwMDg+Ojk6su4FQsZx7mIGce9n/nwVP/BwP4+PnLf4/Ysv9y5mH7cbmZCUrHu9mbMrgNYEgjAz4ebobe2kyQCChAsSZbmMMVtFUHOlmjAi2Ee/A6fMiBUYfTG7AQY9/f9vUMf9vX0cxpbJ8W45SzM9fvlwlwAZXnEzsq0w7AxIlyOKOcCAOTrSaVnEkaYGNlMWBgYADhgIr2WYkdlWkLiHY4U7QtGA8C0M/AwAB2+FBL4wIV7bMcGEZLlQEAow6nNxj05TguMOjLcVxgqJXjcDCaOekNRh1ObzBajuMDoKKUZWsVFZyLAHQpxxl15cjWiwuMluP0BqMOpzcYdTi9wajD6Q1GHU5vMPQd/vHL14F1CRoAzQXhAzCHb1yz9SDDp0HkeJB72FhZGMREBLHKwxy+4NPnrx/Cs5oI+pQeYN7KbQz9c1Yz6Goo4bQNeboQNJQLmjI00FJTYODj4RoQR1+7/ZDh0+evYEfjcLgjaJwc3qyFzicagqYOr9164ICsUk5a3J6fl9sBmynUBqBJK3ERQQZuLg68JmO0xx+dXAUa9T+ALBbVPgs040wXhxMBQBO3RBeHG2AaBhg86KhMu0C0wzsq00BzMIUD7GhQwAXCOIz41aKCivZZoMnSBNq6DysAOXpBR2XaYIh1CgADAwMAv3EUkQX/fccAAAAASUVORK5CYII=";
    static cssClass = "widget-textblock";

    constructor(values) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.data = values?.data ?? { style: "default", text: "" };
    }

    clone() {
        return new WidgetTextBlock(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            const data = {
                instanceId: this.id,
                label: "widgets." + WidgetTextBlock.widget + ".form.label",
                help: "widgets." + WidgetTextBlock.widget + ".form.help",
                style: this.data.style
            }

            return {
                inputs: form(data),
                title: this.translate("widgets.TextBlock.label")
            };
        });
    }

    settingsOpened() {
        var editorElement = $('#f-' + this.id + ' .texteditor');
        this.initTextEditor(this.data.text, editorElement);
    }

    preview() {
        return this?.data?.text?.length ? this.data.text : this.translate("widgets.TextBlock.prev");
    }

    updateModelFromForm(form) {
        this.data.text = this.clearAndSanitizeHtml(form.textblockText);
        this.data.style = form.style;
    }

    validateModel() {
        if (this.data.text.length == 0 || this.isEmptyText(this.data.text))
            return ["TextBlock.text.invalid"];
        return [];
    }

    validateForm(form) {
        if (form.textblockText.length == 0 || this.isEmptyText(form.textblockText))
            return ["TextBlock.text.invalid"];
        return [];
    }
}