import Utils from "../../Utils";

export default class Migration10to11 {

    static run(model: any) {
        const images = Utils.findObjectsOfType(model, "SimpleImage");
        images
            .filter(image => !image.params.align)
            .forEach(image => image.params.align = "left");
    }
}