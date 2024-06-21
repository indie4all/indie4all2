export default class Migration4to5 {

    static async run(model: any) {
        model.sections.forEach((section: any) => {
            delete section.backgroundType;
            delete section.image;
        });
    }
}