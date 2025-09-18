import { inject, injectable } from "inversify";
import Config from "../../../config";
import { Model } from "../../elements/model";
import BootstrapService from "../../services/bootstrap/bootstrap.service";
import LoadingService from "../../services/loading/loading.service";
import I18nService from "../../services/i18n/i18n.service";
import UtilsService from "../../services/utils/utils.service";
import ModalUnitSettings from "../modal-unit-settings/unit-settings.service";

@injectable()
export default class ModalNetlify {

    constructor(
        @inject(BootstrapService) private bootstrap: BootstrapService,
        @inject(LoadingService) private loading: LoadingService,
        @inject(I18nService) private i18n: I18nService,
        @inject(UtilsService) private utils: UtilsService,
        @inject(ModalUnitSettings) private settings: ModalUnitSettings) { }

    private async onSubmitToken(model: Model, token: string, siteId: string, siteUrl: string) {
        if (Config.isRequestAdditionalDataOnPopulate()) {
            await this.settings.show(model,
                this.i18n.value(`common.unit.settings`), (model) =>
                this.onSubmitSettings(token, siteId, siteUrl, model));
        } else await this.onSubmitSettings(token, siteId, siteUrl, model);
    }

    private async onSubmitSettings(token: string, siteId: string, siteUrl: string, model: Model) {
        const title = this.i18n.value("common.publishToNetlify.title");
        const description = this.i18n.value("common.publishToNetlify.description");
        await this.loading.show(title, description);
        // Download the generated files
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        const requestOptions = { method: 'POST', body: JSON.stringify({ token, site_id: siteId, site_url: siteUrl, model }), headers };
        const response = await fetch(Config.getPublishToNetlifyBackendURL(), requestOptions);
        await this.loading.hide();
        if (!response.ok) {
            if (response.status === 401 && Config.getUnauthorizedMessage())
                this.utils.notifyUnauthorizedError(Config.getUnauthorizedMessage())
            else this.utils.notifyError(this.i18n.value("messages.publishError"));
            return;
        }
        const json = await response.json();
        const { default: netlifyGeneratedModal } = await import("./netlify-url.hbs");
        document.body.insertAdjacentHTML('beforeend', netlifyGeneratedModal());
        const modalModule = await this.bootstrap.loadModalModule();
        const modalElem = document.getElementById('modal-netlify-generated');
        const modal = modalModule.getOrCreateInstance(modalElem, { backdrop: true });
        const url = modalElem.querySelector('#modal-netlify-generated-url') as HTMLAnchorElement;
        url.href = json.url;
        url.textContent = json.url;
        modal.show();
    }

    async start(model: Model) {
        const { default: netlifyModal } = await import("./netlify-token.hbs");
        document.body.insertAdjacentHTML('beforeend', netlifyModal());
        const modalModule = await this.bootstrap.loadModalModule();
        const modalElem = document.getElementById('modal-netlify');
        // [Fix] https://github.com/twbs/bootstrap/issues/41005
        modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
        modalElem.addEventListener('hidden.bs.modal', () => modalElem.remove());
        const modal = modalModule.getOrCreateInstance(document.getElementById('modal-netlify'), { keyboard: false, backdrop: 'static', focus: true });
        modal.show();
        modalElem.querySelector('.btn-submit').addEventListener('click', () => form.requestSubmit());
        const token = modalElem.querySelector("#token-netlify") as HTMLInputElement;
        const form = document.getElementById('f-netlify-settings') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            const site = modalElem.querySelector("#select-sites") as HTMLSelectElement;
            e.preventDefault();
            if (!site?.value) return;
            modal.hide();
            this.onSubmitToken(model, token.value, site.value, site.options[site.selectedIndex].text);
        });
        modalElem.querySelector('#confirm-token').addEventListener('click', async () => {
            const divSites = modalElem.querySelector("#div-sites");
            const { default: optionsSitesTemplate } = await import("./netlify-sites-options.hbs");
            const response = await fetch('https://api.netlify.com/api/v1/sites', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token.value}` }
            });
            if (!response.ok) {
                divSites.innerHTML = optionsSitesTemplate({ sites: [], incorrectToken: true });
                divSites.classList.remove("d-none");
                return;
            }
            const sites = await response.json();
            divSites.innerHTML = optionsSitesTemplate({ sites, incorrectToken: false });
            divSites.classList.remove("d-none");
        });
    }
}