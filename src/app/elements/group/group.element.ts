import './styles.scss';
import icon from "./icon.png";;
import { InputWidgetGroupData, WidgetInitOptions } from "../../../types";
import ContainerElement from '../container/container.element';
import WidgetElement from '../widget/widget.element';

export default class GroupElement extends ContainerElement {

    static widget = "Group";
    static category = "containers";
    static icon = icon;
    protected static _editable: boolean = false;

    data: WidgetElement[]

    constructor() { super(); }

    async init(values?: InputWidgetGroupData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) : [];
    }

    get form(): Promise<string> {
        return Promise.resolve('');
    }

    get preview(): string { return this.translate("widgets.Group.label"); }

    get texts() {
        return { "children": this.data.map(child => child.texts) }
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    settingsOpened(): void { }

    updateModelFromForm(form: any): void { }

    set texts(texts: any) {
        (texts.children as any[]).forEach((text, idx) => this.data[idx].texts = text);
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("Group.data.empty")
        return keys;
    }

    validateForm(form: any): string[] { return []; }
}
