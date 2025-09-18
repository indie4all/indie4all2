import { inject, injectable } from "inversify";
import Config from "../../../config";
import LoadingService from "../loading/loading.service";
import { Model } from "../../elements/model";
import UtilsService from "../utils/utils.service";
import ModelHandlerService from "./model-handler.service";

@injectable()
export default class ModelHandlerSaveService extends ModelHandlerService {

    @inject(LoadingService) private loading: LoadingService;
    @inject(UtilsService) private utils: UtilsService;

    protected async handle(model: Model) {
        const title = this.i18n.value("common.save.title");
        const description = this.i18n.value("common.save.description");
        await this.loading.show(title, description);
        try {
            // Download the generated files
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Accept", "application/json");
            const requestOptions = { method: 'POST', body: JSON.stringify(model), headers };
            const response = await fetch(Config.getSaveBackendURL(), requestOptions);
            await this.loading.hide();
            if (!response.ok) {
                if (response.status === 401 && Config.getUnauthorizedMessage())
                    this.utils.notifyUnauthorizedError(Config.getUnauthorizedMessage())
                else this.utils.notifyError(this.i18n.value("messages.previewError"));
                return;
            }

            const json = await response.json();
            if (json.success) this.utils.notifySuccess(this.i18n.value("messages.savedUnit"));
            else this.utils.notifyError(this.i18n.value("messages.saveError"));

        } catch (error) {
            console.log('error', error);
            await this.loading.hide();
        }
    }
}