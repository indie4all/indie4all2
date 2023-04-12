import './styles.scss';
import WidgetContainerElement from '../WidgetContainerElement/WidgetContainerElement';
import ModelManager from '../../ModelManager';
import icon from "./icon.png";
import WidgetItemElement from '../WidgetItemElement/WidgetItemElement';
import { FormEditData, InputWidgetAcordionContentData, WidgetAcordionContentParams } from '../../../types';

export default class WidgetAcordionContent extends WidgetContainerElement {

    protected static copyable: boolean = false;

    static widget = "AcordionContent";
    static icon = icon;
    params: WidgetAcordionContentParams;
    data: WidgetItemElement[];

    static async create(values?: InputWidgetAcordionContentData): Promise<WidgetAcordionContent> {
        const container = new WidgetAcordionContent(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetAcordionContentData) {
        super(values);
        this.params = values?.params ? structuredClone(values.params) : { title: "" };
    }

    clone(): WidgetAcordionContent {
        const widget = new WidgetAcordionContent();
        widget.params = structuredClone(this.params);
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    async getInputs(): Promise<FormEditData> {
        const { default: form } = await import('./form.hbs');
        var data = { instanceId: this.id, title: this.params.title ?? '' };
        return {
            inputs: form(data),
            title: this.translate("widgets.AcordionContent.label")
        };
    }

    preview(): string {
        return this.translate("widgets.AcordionContent.label") + " " + (this.params?.title ?? "");
    }

    updateModelFromForm(form: any): void {
        this.params.title = form.title;
    }

    validateModel(): string[] {
        var errors: string[] = [];
        if (this.params.title.length == 0) errors.push("AcordionContent.title.invalid");
        if (this.data.length == 0) errors.push("AcordionContent.data.empty");
        return errors;
    }

    validateForm(form: any): string[] {
        if (form.title.length == 0)
            return ["AcordionContent.title.invalid"]
        return [];
    }
}