import Utils from "../../../Utils";
import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData, InputWidgetCalloutData, WidgetCalloutParams} from "../../../types";


export default class WidgetCallout extends WidgetContainerElement {

    static widget = "Callout";
    static category = "containers";
    static icon = icon;

    params: WidgetCalloutParams;
    data: WidgetElement[]

    static async create(values?: InputWidgetCalloutData): Promise<WidgetCallout> {
        const container = new WidgetCallout(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetCalloutData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : {
            text: this.translate("widgets.Callout.form.styles.more"),
            style: "more",
            colorTheme: "",
            animation: "simple"
        };
    }

    clone(): WidgetCallout {
        const widget = new WidgetCallout();
        widget.params = structuredClone(this.params);
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        const data = {
            instanceId: this.id,
            textTitle: this.params.text,
            style : this.params.style,
            colorTheme: this.params.colorTheme,
            animation: this.params.animation
        };
        return {
            inputs: form(data),
            title: this.translate("widgets.Callout.label")
        };
    }

    getTexts() {
        return {
            "style": this.params.style, "name": this.params.text, "animation": this.params.animation, "colorTheme": this.params.colorTheme,
            "children": this.data.map(child => child.getTexts())
        }
    }

    preview(): string {
        return this.params?.text ? this.params?.text :  this.translate("widgets.Callout.label");
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

    updateTexts(texts: any): void {
        this.params.text = texts.textTitle;
        this.params.style = texts.style;
        this.params.colorTheme = texts.colorTheme;
        this.params.animation = texts.animation;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].updateTexts(text));
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
        Coloris.coloris({ el: '#custom-callout-color-picker', parent: '#modal-settings-body', alpha: false, formatToggle: false }); 
        
        $(`#callout-block-style`).on("change", () => {
           const elem = $(`#callout-block-style option:selected`);
           $(`#textTitle`).val($.trim(elem.text()));
           $(`#custom-callout-color-picker`).trigger('change');
        })

        $(`#custom-callout-color-picker`).on('change', function(){
            $colorPicker.val($(this).val() ?? '').closest(".clr-field").css('color', $(this).val() as string);
        })
    }

}
