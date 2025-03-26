import { inject } from "inversify";
import BootstrapService from "../../services/bootstrap/bootstrap.service";
import UtilsService from "../../services/utils/utils.service";
import I18nService from "../../services/i18n/i18n.service";
import { WidgetInitOptions } from "../../../types";
import ContainerManager from "../../../container.manager";
import AlertService from "../../services/alert/alert.service";

export default abstract class Element {

    static widget: string;
    protected static _addable: boolean = false;
    protected static _copyable: boolean = true;
    protected static _editable: boolean = true;
    protected static _deletable: boolean = true;
    protected static _generable: boolean = false;

    static get addable() { return this._addable }
    static set addable(value: boolean) { this._addable = value }
    static get copyable() { return this._copyable }
    static set copyable(value: boolean) { this._copyable = value }
    static get editable() { return this._editable }
    static set editable(value: boolean) { this._editable = value }
    static get deletable() { return this._deletable }
    static set deletable(value: boolean) { this._deletable = value }
    static get generable() { return this._generable }
    static set generable(value: boolean) { this._generable = value }

    static hasChildren() { return false; }

    protected container: ContainerManager = ContainerManager.instance;

    @inject("Factory<Element>")
    protected create: (widget: string, data?: any, options?: WidgetInitOptions) => Promise<Element>;

    @inject(BootstrapService)
    protected bootstrap: BootstrapService;

    @inject(UtilsService)
    protected utils: UtilsService;

    @inject(I18nService)
    protected i18n: I18nService;

    @inject(AlertService)
    protected alert: AlertService;

    public id: string;
    public params: any;
    public data: any;
    public skipNameValidation: boolean = false;

    constructor() { }

    public async init(values?: any, options: WidgetInitOptions = { regenerateId: false }): Promise<void> {
        this.id = (options.regenerateId || !values?.id) ? this.utils.generate_uuid() : values.id;
    }

    protected abstract get form(): Promise<string>;
    abstract createElement(): string;
    abstract get texts(): any;
    abstract set texts(texts: any);
    abstract get preview(): string
    abstract updateModelFromForm(form: any): void;
    abstract validateForm(form: any): string[];
    abstract validateModel(): string[];

    protected get title() {
        return this.i18n.value("widgets." + (<typeof Element>this.constructor).widget + ".label");
    }

    settingsClosed(): void { }
    settingsOpened(): void { }
    toJSON(): any { return { id: this.id, widget: (<typeof Element>this.constructor).widget } }
    translate(query: string) { return this.i18n.value(query); }
    onSubmitEditForm(): void { }
    onHideEditModal(): void { }

    async clone(): Promise<Element> {
        const widget = (<typeof Element>this.constructor).widget;
        return await this.create(widget, this.toJSON(), { regenerateId: true });
    }

    async edit(successCallback?: (formData: any) => Promise<void>): Promise<void> {
        const { default: template } = await import('./modal-edit.hbs');
        const content = template({ id: this.id, title: this.title, form: await this.form });
        document.body.insertAdjacentHTML('beforeend', content);
        const modalElem = document.getElementById('widget-editor-' + this.id);
        const modalModule = await this.bootstrap.loadModalModule();
        const modal = modalModule.getOrCreateInstance(modalElem, { keyboard: false, backdrop: 'static', focus: false });
        // [Fix] https://github.com/twbs/bootstrap/issues/41005
        modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        modalElem.addEventListener('hidden.bs.modal', () => {
            this.onHideEditModal();
            modalElem.remove()
        });
        modalElem.addEventListener('shown.bs.modal', () => modalElem.focus());
        const formEle = modalElem.querySelector('form') as HTMLFormElement;
        formEle.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.onSubmitEditForm();
            const formData = this.utils.toJSON(formEle);
            const errors = this.validateForm(formData);
            if (errors.length > 0) {
                this.alert.danger(
                    modalElem.querySelector('.errors'),
                    errors.map(error => this.i18n.value("errors." + error)).join(". "));
                return;
            }
            this.settingsClosed();
            modal.hide();
            this.updateModelFromForm(formData);
            modalElem.remove();
            if (successCallback) await successCallback(formData);
        });

        modalElem.addEventListener('click', (e) => {
            const elem = e.target as HTMLElement;
            if (elem.closest('.btn-submit')) formEle.requestSubmit();
        });
        this.settingsOpened();
        modal.show();
    }

}