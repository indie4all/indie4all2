import './styles.scss';
import icon from "./icon.png";
import { InputWidgetCalloutData, WidgetCalloutParams, WidgetInitOptions } from "../../../types";
import ContainerElement from '../container/container.element';
import WidgetElement from '../widget/widget.element';


export default class CalloutElement extends ContainerElement {

    static widget = "Callout";
    static category = "containers";
    static icon = icon;

    params: WidgetCalloutParams;
    data: WidgetElement[]

    constructor() { super(); }

    async init(values?: InputWidgetCalloutData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            text: this.translate("widgets.Callout.form.styles.more"),
            style: "more",
            colorTheme: "",
            animation: "simple"
        };
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form() {
        return import('./form.hbs')
            .then((module) => module.default({
                instanceId: this.id,
                textTitle: this.params.text,
                style: this.params.style,
                colorTheme: this.params.colorTheme,
                animation: this.params.animation
            }));
    }

    get preview() { return this.params?.text ? this.params?.text : this.title; }

    get texts() {
        return {
            "text": this.params.text,
            "children": this.data.map(child => child.texts)
        }
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    settingsOpened(): void {
        this.events();
    }

    updateModelFromForm(form: any): void {
        this.params.text = form.textTitle;
        this.params.style = form.style;
        this.params.colorTheme = form.colorTheme;
        this.params.animation = form.animation;
    }

    set texts(texts: any) {
        this.params.text = texts.text;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].texts = text);
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Callout.data.empty")
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        return keys;
    }

    public async events() {
        await import("@melloware/coloris/dist/coloris.css");
        const { default: Coloris } = await import("@melloware/coloris");
        Coloris.init();
        const $colorPicker = $("#custom-callout-color-picker");
        Coloris.coloris({ el: '#custom-callout-color-picker', parent: '.widget-editor-body', alpha: false, formatToggle: false });

        $(`#callout-block-style`).on("change", () => {
            const elem = $(`#callout-block-style option:selected`);
            $(`#textTitle`).val($.trim(elem.text()));
            $(`#custom-callout-color-picker`).trigger('change');
        })

        $(`#custom-callout-color-picker`).on('change', function () {
            $colorPicker.val($(this).val() ?? '').closest(".clr-field").css('color', $(this).val() as string);
        })
    }

}
