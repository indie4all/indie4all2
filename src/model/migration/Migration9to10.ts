import Utils from "../../Utils";

export default class Migration9to10 {

    static async run(model: any) {
        const videos = Utils.findObjectsOfType(model, "Video");
        videos
            .filter(video => !video.data.defaultCaptions)
            .forEach(video => video.data.defaultCaptions = "0");
    }
}