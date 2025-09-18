import { inject, injectable } from "inversify";
import I18nService from "../../services/i18n/i18n.service";
import BootstrapService from "../../services/bootstrap/bootstrap.service";

@injectable()
export default class ModalTranslate {

    private _submitCallback: (e: Event, from: string, to: string) => void = () => { };

    constructor(@inject(I18nService) private i18n: I18nService,
        @inject(BootstrapService) private bootstrap: BootstrapService) { }

    public async show(): Promise<void> {
        return new Promise(async (resolve) => {
            const { default: template } = await import('./template.hbs');
            document.body.insertAdjacentHTML('beforeend', template({
                languages: this.i18n.allLanguages.map(lang => lang.toUpperCase()),
                language: this.i18n.lang.toUpperCase()
            }));
            const modalElem = document.getElementById('modal-translate');
            // [Fix] https://github.com/twbs/bootstrap/issues/41005
            modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
            modalElem.addEventListener('hidden.bs.modal', () => modalElem.remove());
            modalElem.addEventListener('shown.bs.modal', () => resolve());
            const form = modalElem.querySelector('#f-translate-unit') as HTMLFormElement;
            form.addEventListener('submit', async (e) => {
                if (this._submitCallback) {
                    const srcInput = modalElem.querySelector('#source-unit-language') as HTMLInputElement;
                    const tgtInput = modalElem.querySelector('#target-unit-language') as HTMLInputElement;
                    this._submitCallback(e, srcInput.value, tgtInput.value);
                }
                await this.hide();
            });
            modalElem.querySelector('.btn-submit').addEventListener('click',
                () => form.requestSubmit());
            const modalModule = await this.bootstrap.loadModalModule();
            const modal = modalModule.getOrCreateInstance(modalElem, { keyboard: false, backdrop: 'static' });
            modal.show();
        });
    }

    public async hide(): Promise<void> {
        const modalModule = await this.bootstrap.loadModalModule();
        return new Promise<void>((resolve) => {
            const modalElem = document.getElementById('modal-translate');
            const modal = modalModule.getInstance(modalElem);
            modalElem.addEventListener('hidden.bs.modal', () => resolve());
            modal.hide();
        });
    }

    public get submitCallback(): (e: Event, from: string, to: string) => void {
        if (this._submitCallback) return this._submitCallback;
        return () => { };
    }
    public set submitCallback(callback: (e: Event, from: string, to: string) => void) { this._submitCallback = callback; }
}