/* global $ */
import RichTextEditorElement from "../mixings/RichTextEditorElement";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetTextBlock extends WidgetItemElement {

    static widget = "TextBlock";
    static type = "element";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-textblock";

    constructor(values) {
        super(values);
        // Add the behaviour of a RichTextEditorElement to the current object
        Object.assign(this, RichTextEditorElement);
        this.data = values?.data ? structuredClone(values.data) : { style: "default", text: "" };
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