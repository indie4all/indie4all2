import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration10to11 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const images = this.utils.findObjectsOfType(model, "SimpleImage");
        images
            .filter(image => !image.params.align)
            .forEach(image => image.params.align = "left");
    }
}