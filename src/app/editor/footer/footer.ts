import { inject, injectable } from "inversify";
import I18nService from "../../services/i18n/i18n.service";
import ContainerManager from "../../../container.manager";
import ButtonAction from "../btn/btn.action";
import ButtonClickAction from "../btn/btn.click.action";
import Config from "../../../config";

@injectable()
export default class Footer {

    private _actions: { [x: string]: ButtonAction } = {};
    private _container: HTMLElement;

    constructor(@inject(I18nService) private i18n: I18nService) { }

    private async enable(name: string, title: string, type: string, icon: string): Promise<ButtonAction> {
        const { default: template } = await import('./btn-wrapper.hbs');
        const prefix = 'author-';
        this._container.insertAdjacentHTML('beforeend', template({ name, title, icon }));
        const listItem = this._container.querySelector('li:last-child') as HTMLElement;
        const action = ContainerManager.instance.get(ButtonClickAction);
        await action.init(prefix + name, title, type, icon, listItem);
        this._actions[name] = action;
        return action;
    }

    private async enableAddSectionWithAI(): Promise<void> {
        await this.enable('add-section-ai', this.i18n.value('header.addSectionAI'), 'btn-success', 'fa-brain');
    }

    private async enableAddSection(): Promise<void> {
        await this.enable('add-section', this.i18n.value('header.addSection'), 'btn-success', 'fa-plus-circle');
    }

    private async enableImportSection(): Promise<void> {
        await this.enable('import-section', this.i18n.value('header.importSection'), 'btn-success', 'fa-file-import');
    }

    private async enableClear(): Promise<void> {
        await this.enable('clear', this.i18n.value('header.clear'), 'btn-danger', 'fa-trash-alt');
    }

    public async init(): Promise<void> {
        this._container = document.querySelector('.footer-buttons') as HTMLElement;
        if (!Config.isWidgetEditorEnabled()) await this.enableAddSection();
        if (!Config.isWidgetEditorEnabled() && Config.getAIURL()) await this.enableAddSectionWithAI();
        if (!Config.isWidgetEditorEnabled()) await this.enableImportSection();
        if (!Config.isWidgetEditorEnabled()) await this.enableClear();
    }

    private getAction(name: string): ButtonAction { return this._actions[name]; }
    public get addSection(): ButtonAction { return this.getAction('add-section'); }
    public get addSectionWithAI(): ButtonAction { return this.getAction('add-section-ai'); }
    public get importSection(): ButtonAction { return this.getAction('import-section'); }
    public get clear(): ButtonAction { return this.getAction('clear'); }
}