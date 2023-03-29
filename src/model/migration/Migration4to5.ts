import Utils from "../../Utils";

export default class Migration4to5 {

    static run(model: any) {
        model.sections.forEach((section: any) => {
            delete section.backgroundType;
            delete section.image;
        });
    }
}