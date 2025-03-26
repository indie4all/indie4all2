import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration9to10 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const videos = this.utils.findObjectsOfType(model, "Video");
        videos
            .filter(video => !video.data.defaultCaptions)
            .forEach(video => video.data.defaultCaptions = "0");
    }
}