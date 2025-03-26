import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration7to8 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const types = ['Video', 'ImageAndSoundItem', 'AudioTermItem'];
        const widgetAudioCaptions = this.utils.findObjectsOfType(model, types);
        widgetAudioCaptions.forEach(instance => {
            if (typeof instance.data.captions !== "string")
                instance.data.captions = "";
            if (instance.widget === "Video" && typeof instance.data.descriptions !== "string")
                instance.data.descriptions = "";
        });
    }
}