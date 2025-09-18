import { inject, injectable } from 'inversify';
import BootstrapService from '../bootstrap/bootstrap.service';
import I18nService from '../i18n/i18n.service';


@injectable()
export default class LoadingService {

    private shown: boolean = false;

    constructor(
        @inject(BootstrapService) private bootstrap: BootstrapService,
        @inject(I18nService) private i18n: I18nService) { }

    public async show(title?: string, description?: string): Promise<void> {
        // Do not show the loading modal if it is already shown
        if (this.shown) return Promise.resolve();
        return new Promise(async (resolve) => {
            const { default: template } = await import('./template.hbs');
            document.body.insertAdjacentHTML('beforeend', template({
                title: title ?? this.i18n.value('common.loading.title'),
                description: description ?? this.i18n.value('common.loading.description')
            }));
            const modalElem = document.getElementById('modal-loading');
            // [Fix] https://github.com/twbs/bootstrap/issues/41005
            modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
            modalElem.addEventListener('hidden.bs.modal', () => modalElem.remove());
            modalElem.addEventListener('shown.bs.modal', () => resolve());
            const modalModule = await this.bootstrap.loadModalModule();
            const modal = modalModule.getOrCreateInstance(modalElem, { keyboard: false, backdrop: 'static' });
            this.shown = true;
            modal.show();

        });
    }

    public async hide(): Promise<void> {
        // Do not hide the loading modal if it is already hidden
        if (!this.shown) return Promise.resolve();
        const modalElem = document.getElementById('modal-loading');
        const modalModule = await this.bootstrap.loadModalModule();
        const modal = modalModule.getOrCreateInstance(modalElem);
        this.shown = false;
        modal.hide();
    }
}