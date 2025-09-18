import { injectable } from "inversify";
import Migration from "./migration";

@injectable()
export default class Migration4to5 extends Migration {

    async run(model: any) {
        model.sections.forEach((section: any) => {
            delete section.backgroundType;
            delete section.image;
        });
    }
}