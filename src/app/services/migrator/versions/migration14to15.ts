import { inject, injectable } from "inversify";
import Config from "../../../../config";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration14to15 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    private async getNewUrl(oldURL: string): Promise<string> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = { method: 'POST', body: JSON.stringify({ oldURL }), headers };
        return await (await fetch(Config.getMediaMigrationURL(), requestOptions)).text();
    }

    // Migrate legacy AnimationWidget to use media URLs
    async run(model: any) {
        if (!Config.getMediaMigrationURL()) return;
        const animationElements = this.utils.findObjectsOfType(model, "AnimationContainer");
        for (let obj of animationElements) {
            if (obj?.params?.image && obj.params.image.startsWith('http'))
                obj.params.image = await this.getNewUrl(obj.params.image);
            if (Array.isArray(obj?.data) && obj.data.length > 0) {
                for (let item of obj.data) {
                    if (item?.data?.image && item?.data?.image.startsWith('http'))
                        item.data.image = await this.getNewUrl(item.data.image);
                }
            }
        }
    }
}
