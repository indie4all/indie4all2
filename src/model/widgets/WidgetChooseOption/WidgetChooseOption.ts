/* global $ */
import Utils from "../../../Utils";
import "./styles.scss";
import WidgetItemElement from "../WidgetItemElement/WidgetItemElement";
import icon from "./icon.png";
import { WidgetChooseOptionItem, InputWidgetChooseOptionData, WidgetChooseOptionParams, WidgetChooseOptionData } from "../../../types";

export default abstract class WidgetChooseOption extends WidgetItemElement {

    static widget = "ChooseOption";
    static category = "interactiveElements";
    static icon = icon;

    protected static optionsNumber: number = 4;
    protected static optionsWithoutCorrect(options) {
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.correct)
                return false;
        }
        return true;
    }

    params: WidgetChooseOptionParams;
    data: WidgetChooseOptionData;

    static async create(values?: InputWidgetChooseOptionData): Promise<WidgetChooseOption> { return null; }

    preview(): string {
        return this.params?.name && this.data?.text ?
            this.params.name + " | " + this.data.text : this.translate("widgets.ChooseOption.prev");
    }

    updateModelFromForm(form: any): void {
        var options: WidgetChooseOptionItem[] = [];
        for (var i = 0; i < WidgetChooseOption.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({ text: option, correct: parseInt(form.correct) == i })
            }
        }

        this.data.options = options;
        this.data.text = form.text;
        this.params.name = form.instanceName;
        this.params.help = form.help;
        this.data.alt = form.alt;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.data.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (WidgetChooseOption.optionsWithoutCorrect(this.data.options))
            errors.push("ChooseOption.options.noCorrect");
        if (this.data.options.length != WidgetChooseOption.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (!Utils.hasNameInParams(this))
            errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(this.data.alt))
            errors.push("common.alt.invalid")
        return errors;
    }

    validateForm(form: any): string[] {
        var errors: string[] = [];
        var options: WidgetChooseOptionItem[] = [];

        for (var i = 0; i < WidgetChooseOption.optionsNumber; i++) {
            var option = form["option" + i];
            if (option && (option.length > 0)) {
                options.push({ text: option, correct: parseInt(form.correct) == i })
            }
        }

        if (form.text.length == 0) errors.push("ChooseOption.text.invalid");
        if (WidgetChooseOption.optionsWithoutCorrect(options))
            errors.push("ChooseOption.options.noCorrect");
        if (options.length != WidgetChooseOption.optionsNumber)
            errors.push("ChooseOption.options.notEnougOptions");
        if (form.instanceName.length == 0) errors.push("common.name.invalid");
        if (Utils.isStringEmptyOrWhitespace(form.alt)) errors.push("common.alt.invalid")
        return errors;
    }
}
