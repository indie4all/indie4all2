import './styles.scss';
import icon from "./icon.png";
import { InputWidgetModalData, WidgetInitOptions, WidgetModalParams } from "../../../types";
import ContainerElement from "../container/container.element";
import WidgetElement from "../widget/widget.element";

export default class ModalElement extends ContainerElement {

    protected static _generable: boolean = true;
    static widget = "Modal";
    static category = "containers";
    static icon = icon;

    params: WidgetModalParams;
    data: WidgetElement[]

    constructor() { super(); }

    async init(values?: InputWidgetModalData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: ModalElement.widget + "-" + this.id,
            text: "",
            help: ""
        };
        if (options.regenerateId) this.params.name = ModalElement.widget + "-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            text: this.params.text,
            help: this.params.help
        }));
    }

    get texts() {
        return {
            "help": this.params.help, "name": this.params.name, "text": this.params.text,
            "children": this.data.map(child => child.texts)
        }
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.Modal.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.text = form.text;
        this.params.help = form.help;
    }

    set texts(texts: any) {
        this.params.text = texts.text;
        this.params.help = texts.help;
        this.params.name = texts.name;
        (texts.children as any[]).forEach((text, idx) => this.data[idx].texts = text);
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Modal.data.empty");
        if (this.params.text.length == 0) keys.push("Modal.text.invalid");
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.text.length == 0) keys.push("Modal.text.invalid");
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }
}
