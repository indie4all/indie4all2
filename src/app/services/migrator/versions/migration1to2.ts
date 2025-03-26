import { injectable } from "inversify";
import Migration from "./migration";

@injectable()
export default class Migration1to2 extends Migration {

    async run(model: any) {
        const sections = model.sections;
        sections
            .filter((section: any) => !section.bookmark)
            .forEach((section: any) => section.bookmark = 's');
    }
}