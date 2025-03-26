import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration2to3 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const images = this.utils.findObjectsOfType(model, "SimpleImage");
        images
            .filter(image => !image.params.aspect)
            .forEach(image => image.params.aspect = 'original');

        const gapTests = this.utils.findObjectsOfType(model, "GapTest");
        gapTests.forEach(gapTest => gapTest.widget = 'Test');
    }
}