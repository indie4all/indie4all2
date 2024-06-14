import './styles.scss';
import WidgetContainerElement from "../WidgetContainerElement/WidgetContainerElement";
import ModelManager from "../../ModelManager";
import icon from "./icon.png";
import WidgetElement from "../WidgetElement/WidgetElement";
import { FormEditData, InputWidgetGroupData } from "../../../types";

export default class WidgetGroup extends WidgetContainerElement {

    static widget = "Group";
    static category = "containers";
    static icon = icon;
    protected static editable: boolean = false;

    data: WidgetElement[]

    static async create(values?: InputWidgetGroupData): Promise<WidgetGroup> {
        const container = new WidgetGroup(values);
        container.data = values?.data ? await Promise.all(values.data.map(elem => ModelManager.create(elem.widget, elem))) : [];
        return container;
    }

    constructor(values?: InputWidgetGroupData) {
        super(values);
    }

    clone(): WidgetGroup {
        const widget = new WidgetGroup();
        widget.data = this.data.map(elem => elem.clone());
        return widget;
    }

    getInputs(): Promise<FormEditData> {
        throw new Error("Method not implemented.");
    }

    getTexts() {
        return {
            "children": this.data.map(child => child.getTexts())
        }
    }

    preview(): string {
        return this.translate("widgets.Group.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    settingsOpened(): void { }

    updateModelFromForm(form: any): void { }

    updateTexts(texts: any): void {
        (texts.children as any[]).forEach((text, idx) => this.data[idx].updateTexts(text));
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Group.data.empty")
        return keys;
    }

    validateForm(form: any): string[] { return []; }
}
