import Utils from "../../Utils";

export default class Migration1to2 {

    static run(model: any) {
        const sections = model.sections;
        sections
            .filter((section: any) => !section.bookmark)
            .forEach((section: any) => section.bookmark = 's');
    }
}