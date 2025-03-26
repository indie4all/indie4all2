import { inject, injectable } from "inversify";
import BootstrapService from "../bootstrap/bootstrap.service";
import I18nService from "../i18n/i18n.service";
import { PromptOptions } from "./types";

@injectable()
export default class PromptService {

    constructor(@inject(BootstrapService) private bootstrap: BootstrapService,
        @inject(I18nService) private i18n: I18nService) { }

    public async prompt(title: string,
        body: string,
        callback: (result: boolean) => void,
        options?: PromptOptions): Promise<void> {
        const { default: prompt } = await import('./template.hbs');
        const cancel = options?.button?.cancel || this.i18n.value('general.cancel');
        const confirm = options?.button?.confirm || this.i18n.value('general.confirm');
        const data = { title, body, cancel, confirm };
        document.body.insertAdjacentHTML('beforeend', prompt(data));
        const modalModule = await this.bootstrap.loadModalModule();
        const modalElem = document.getElementById('modal-prompt');
        const modal = modalModule.getOrCreateInstance(modalElem);
        // [Fix] https://github.com/twbs/bootstrap/issues/41005
        modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        modalElem.addEventListener('hidden.bs.modal', () => modalElem.remove());
        modalElem.querySelector('.btn-cancel').addEventListener('click', () => {
            callback(false);
            modal.hide();
        });
        modalElem.querySelector('.btn-confirm').addEventListener('click', () => {
            callback(true);
            modal.hide();
        });
        modal.show();
    }


}