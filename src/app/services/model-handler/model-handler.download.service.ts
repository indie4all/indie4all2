import { inject, injectable } from "inversify";
import { Model } from "../../elements/model";
import DownloaderService from "../downloader/downloader.service";
import ModelHandlerService from "./model-handler.service";

@injectable()
export default class ModelHandlerDownloadService extends ModelHandlerService {

    @inject(DownloaderService) private downloader: DownloaderService;

    protected async handle(model: Model) {
        const file = new File([JSON.stringify(model, null, 2)], "model.json", { type: "application/json" });
        this.downloader.download(file);
    }
}