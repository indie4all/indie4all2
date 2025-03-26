import './styles.scss';
import icon from "./icon.png";
import { InputWidgetFourColumnsLayoutData, WidgetInitOptions } from '../../../types';
import ColumnsLayoutElement from '../columns-layout/columns-layout.element';

export default class FourColumnsLayoutElement extends ColumnsLayoutElement {

    static widget = "FourColumnsLayout";
    static category = "layouts";
    static editable = false;
    static icon = icon;
    static columns = [3, 3, 3, 3];

    constructor() { super(); }

    async init(values?: InputWidgetFourColumnsLayoutData, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        await super.init(values, options);
        this.data = values?.data ? await Promise.all(values.data.map(arr => Promise.all(arr.map(elem => this.create(elem.widget, elem, options))))) : [[], [], [], []];
    }

    get form(): Promise<string> { return Promise.resolve(''); }

    toJSON(): any {
        const result = super.toJSON();
        if (this.data) result["data"] = this.data.map(col => col.map(elem => elem.toJSON()));
        return result;
    }

    updateModelFromForm(form: any): void {
        throw new Error('Method not implemented.');
    }
}