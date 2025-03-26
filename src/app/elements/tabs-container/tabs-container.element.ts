import "./styles.scss";
import icon from "./icon.png";
import { InputWidgetTabsContainerData, WidgetInitOptions, WidgetTabsContainerParams } from "../../../types";
import SpecificContainerElement from "../specific-container/specific-container.element";
import TabContentElement from "../tab-content/tab-content.element";


export default class TabsContainerElement extends SpecificContainerElement {
    static widget = "TabsContainer";
    static category = "containers";
    static icon = icon;

    params: WidgetTabsContainerParams;
    data: TabContentElement[];

    constructor() { super(); }

    async init(values?: InputWidgetTabsContainerData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.params = values?.params ? structuredClone(values.params) : {
            name: "Tabs menu-" + this.id,
            help: ""
        };
        if (options.regenerateId) this.params.name = "Tabs menu-" + this.id;
        this.data = values?.data ? await Promise.all(values.data.map(elem => this.create(elem.widget, elem, options))) as TabContentElement[] : [];
    }

    get form(): Promise<string> {
        return import('./form.hbs').then(({ default: form }) => form({
            instanceId: this.id,
            instanceName: this.params.name,
            help: this.params.help
        }));
    }

    get preview(): string {
        return this.params?.name ?? this.translate("widgets.TabsContainer.label");
    }

    toJSON(): any {
        const result = super.toJSON();
        if (this.params) result["params"] = structuredClone(this.params);
        if (this.data) result["data"] = this.data.map(elem => elem.toJSON());
        return result;
    }

    updateModelFromForm(form: any): void {
        this.params.name = form.instanceName;
        this.params.help = form.help;
    }

    validateModel(): string[] {
        var keys: string[] = [];
        if (this.data.length == 0) keys.push("TabsContainer.data.empty");
        if (!this.utils.hasNameInParams(this)) keys.push("common.name.invalid");
        return keys;
    }

    validateForm(form: any): string[] {
        var keys: string[] = [];
        if (form.instanceName.length == 0) keys.push("common.name.invalid");
        return keys;
    }

}