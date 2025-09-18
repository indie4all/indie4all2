import { inject, injectable } from "inversify";
import Config from "../../../config";
import LoadingService from "../loading/loading.service";
import { Model } from "../../elements/model";
import UtilsService from "../utils/utils.service";
import DownloaderService from "../downloader/downloader.service";
import ModelHandlerService from "./model-handler.service";
import BootstrapService from "../bootstrap/bootstrap.service";

@injectable()
export default class ModelHandlerPreviewService extends ModelHandlerService {

    @inject(LoadingService) private loading: LoadingService;
    @inject(UtilsService) private utils: UtilsService;
    @inject(DownloaderService) private downloader: DownloaderService;
    @inject(BootstrapService) private bootstrap: BootstrapService;

    protected async handle(model: Model) {
        const title = this.i18n.value("common.preview.title");
        const description = this.i18n.value("common.preview.description");
        await this.loading.show(title, description);
        try {
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            const response = await fetch(Config.getPreviewBackendURL(), requestOptions);
            await this.loading.hide();
            if (!response.ok) {
                if (response.status === 401 && Config.getUnauthorizedMessage())
                    this.utils.notifyUnauthorizedError(Config.getUnauthorizedMessage())
                else this.utils.notifyError(this.i18n.value("messages.previewError"));
                return;
            }

            const json = await response.json();
            window.open(json.url, '_blank');
            const { default: modalPreview } = await import("./preview.hbs");
            document.body.insertAdjacentHTML('beforeend', modalPreview({ url: json.url }));
            const modalModule = await this.bootstrap.loadModalModule();
            const modalElem = document.getElementById('modal-preview-generated');
            const modal = modalModule.getOrCreateInstance(modalElem, { backdrop: true });
            // [Fix] https://github.com/twbs/bootstrap/issues/41005
            modalElem.addEventListener('hide.bs.modal', () => document.activeElement instanceof HTMLElement && document.activeElement.blur());
            modalElem.addEventListener('hidden.bs.modal', () => modalElem.remove());
            modal.show();
        } catch (error) {
            console.log('error', error);
            await this.loading.hide();
        }
    }
}


