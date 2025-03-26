import { inject, injectable } from "inversify";
import Config from "../../../config";
import LoadingService from "../loading/loading.service";
import { Model } from "../../elements/model";
import UtilsService from "../utils/utils.service";
import DownloaderService from "../downloader/downloader.service";
import ModelHandlerService from "./model-handler.service";

@injectable()
export default class ModelHandlerPublishService extends ModelHandlerService {

    @inject(LoadingService) private loading: LoadingService;
    @inject(UtilsService) private utils: UtilsService;
    @inject(DownloaderService) private downloader: DownloaderService;

    protected async handle(model: Model) {
        const title = this.i18n.value("common.publish.title");
        const description = this.i18n.value("common.publish.description");
        await this.loading.show(title, description);
        try {
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json, application/octet-stream");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            const response = await fetch(Config.getPublishBackendURL(), requestOptions);
            if (!response.ok) {
                await this.loading.hide();
                if (response.status === 401 && Config.getUnauthorizedMessage())
                    this.utils.notifyUnauthorizedError(Config.getUnauthorizedMessage())
                else this.utils.notifyError(this.i18n.value("messages.publishError"));
                return;
            }

            return new Promise<void>(resolve => {
                const type = response.headers.get('content-type') ?? undefined;
                const filename = response.headers.get('content-disposition')?.split(';')
                    .find((n: string) => n.trim().startsWith('filename='))?.replace('filename=', '')
                    .replaceAll('"', '')
                    .trim() ?? "model.zip";

                response.blob().then(async (blob: Blob) => {
                    const zip = new File([blob], filename, { type });
                    this.downloader.download(zip);
                    await this.loading.hide();
                    resolve();
                });
            });
        } catch (error) {
            console.log('error', error);
            await this.loading.hide();
        }
    }
}