/* global $ */
import "./styles.scss";
import icon from "./icon.png";
import { WidgetChooseOptionItem, WidgetChooseOptionParams, WidgetChooseOptionData } from "../../../types";
import ItemElement from "../item/item.element";

export default abstract class ChooseOptionElement extends ItemElement {

    static widget = "ChooseOption";
    static category = "interactiveElements";
    static icon = icon;

    protected static optionsNumber: number = 8;
    protected static optionsWithoutCorrect(options: WidgetChooseOptionItem[]): boolean {
        return options.every(opt => opt.correct === false);
    }

    params: WidgetChooseOptionParams;
    data: WidgetChooseOptionData;

    get preview() {
        return this.params?.name && this.data?.text ?
            this.params.name + " | " + this.data.text : this.translate("widgets.ChooseOption.prev");
    }

    get texts() {
        return {
            "help": this.params.help,
            "name": this.params.name,
            "alt": this.data.alt,
            "text": this.data.text,
            "options": this.data.options.map(opt => ({ "text": opt.text }))
        }
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = structuredClone(this.data);
        return result;
    }

    updateModelFromForm(form: any): void {
        const options: WidgetChooseOptionItem[] = [];
        for (var i = 0; i < ChooseOptionElement.optionsNumber; i++) {
            var option = form["option" + i];
            if (!this.utils.isStringEmptyOrWhitespace(option)) {
                options.push({ text: option, correct: parseInt(form.correct) == i })
            }
        }

        this.data.options = options;
        this.data.text = form.text;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    set texts(texts: any) {
        this.params.help = texts.help;
        this.params.name = texts.name;
        this.data.alt = texts.alt;
        this.data.text = texts.text;
        (texts.options as any[]).forEach((text, idx) => this.data.options[idx].text = text.text);
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (ChooseOptionElement.optionsWithoutCorrect(this.data.options))
            errors.push("ChooseOption.options.noCorrect");
        if (this.data.options.length < 2)
            errors.push("ChooseOption.options.notEnougOptions");
        if (!this.utils.hasNameInParams(this))
            errors.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        var options: WidgetChooseOptionItem[] = [];

        for (var i = 0; i < ChooseOptionElement.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({ text: option, correct: parseInt(form.correct) == i })
            }
        }

        if (form.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (ChooseOptionElement.optionsWithoutCorrect(options))
            errors.push("ChooseOption.options.noCorrect");
        if (options.length < 2)
            errors.push("ChooseOption.options.notEnougOptions");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (this.utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
