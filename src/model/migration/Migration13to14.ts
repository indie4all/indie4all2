import Config from "../../Config";
import Utils from "../../Utils";

export default class Migration13to14 {

    private static async getNewUrl(oldURL: string): Promise<string> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = { method: 'POST', body: JSON.stringify({ oldURL }), headers };
        return await (await fetch(Config.getMediaMigrationURL(), requestOptions)).text();
    }

    static async run(model: any) {
        if (!Config.getMediaMigrationURL()) return;
        // All this widgets follow a common pattern
        const dataImageElements = ["Animation", "ButtonTextItem", "ChooseOption", "CorrectWordItem", "ImageAndText", "Image", "SimpleImage", "Puzzle", "SchemaItem"];
        const objs = Utils.findObjectsOfType(model, dataImageElements).filter(obj => obj?.data?.image && obj.data.image.startsWith('http'));
        for (let obj of objs)
            obj.data.image = await Migration13to14.getNewUrl(obj.data.image);

        const audioTerms = Utils.findObjectsOfType(model, "AudioTermItem");
        for (let obj of audioTerms) {
            if (obj?.data?.audio && obj.data.audio.startsWith('http'))
                obj.data.audio = await Migration13to14.getNewUrl(obj.data.audio);
            if (obj?.data?.captions && obj.data.captions.startsWith('http'))
                obj.data.captions = await Migration13to14.getNewUrl(obj.data.captions);
        }

        const couples = Utils.findObjectsOfType(model, "CouplesItem");
        for (let obj of couples) {
            if (Array.isArray(obj.data.couples))
                for (let couple of obj.data.couples)
                    if (couple?.image && couple.image.startsWith('http'))
                        couple.image = await Migration13to14.getNewUrl(couple.image);
        }

        const imageAndSound = Utils.findObjectsOfType(model, "ImageAndSoundItem");
        for (let obj of imageAndSound) {
            if (obj?.data?.image && obj.data.image.startsWith('http'))
                obj.data.image = await Migration13to14.getNewUrl(obj.data.image);
            if (obj?.data?.audio && obj.data.audio.startsWith('http'))
                obj.data.audio = await Migration13to14.getNewUrl(obj.data.audio);
            if (obj?.data?.captions && obj.data.captions.startsWith('http'))
                obj.data.captions = await Migration13to14.getNewUrl(obj.data.captions);
        }

        const videos = Utils.findObjectsOfType(model, "Video").filter(video => video.data.videourl &&
            !Utils.isYoutubeVideoURL(video.data.videourl) &&
            !Utils.isRelativeURL(video.data.videourl));

        for (let video of videos)
            video.data.videourl = await Migration13to14.getNewUrl(video.data.videourl);
    }
}
