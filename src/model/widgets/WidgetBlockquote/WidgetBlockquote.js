import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";

export default class WidgetBlockquote extends WidgetItemElement {

    static widget = "Blockquote";
    static type = "element";
    static category = "simpleElements";
    static toolbar = { edit: true };
    static icon = icon;
    static cssClass = "widget-blockquote";

    constructor(values) {
        super(values);
        this.data = values?.data ? structuredClone(values.data) : { quote: "", caption: "", alignment: "", source: "" };
    }

    clone() {
        return new WidgetBlockquote(this);
    }

    getInputs() {
        return import('./form.hbs').then(({default: form}) => {
            return {
                inputs: form({
                    instanceId: this.id,
                    caption: this.data.caption,
                    quote: this.data.quote,
                    alignment: this.data.alignment,
                    source: this.data.source
                }),
                title: this.translate("widgets.Blockquote.label")
            };
        });
    }

    preview() {
        return this.data?.quote ? this.data.quote : this.translate("widgets.Blockquote.prev");
    }

    updateModelFromForm(form) {
        this.data.quote = form.quote;
        this.data.caption = form.caption;
        this.data.alignment = form.alignment;
        this.data.source = form.source;
    }

    validateModel() {
        const errors = [];
        if (this.data.quote.length == 0)
            errors.push("Blockquote.quote.invalid");
        return errors;
    }

    validateForm(form) {
        if (form.quote.length == 0)
            return ["Blockquote.quote.invalid"];
        return [];
    }
}