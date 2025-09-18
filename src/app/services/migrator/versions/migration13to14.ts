import { inject, injectable } from "inversify";
import Config from "../../../../config";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration13to14 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    private async getNewUrl(oldURL: string): Promise<string> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = { method: 'POST', body: JSON.stringify({ oldURL }), headers };
        return await (await fetch(Config.getMediaMigrationURL(), requestOptions)).text();
    }

    async run(model: any) {
        if (!Config.getMediaMigrationURL()) return;
        // All this widgets follow a common pattern
        const dataImageElements = ["Animation", "ButtonTextItem", "ChooseOption", "CorrectWordItem", "ImageAndText", "Image", "SimpleImage", "Puzzle", "SchemaItem"];
        const objs = this.utils.findObjectsOfType(model, dataImageElements).filter(obj => obj?.data?.image && obj.data.image.startsWith('http'));
        for (let obj of objs)
            obj.data.image = await this.getNewUrl(obj.data.image);

        const audioTerms = this.utils.findObjectsOfType(model, "AudioTermItem");
        for (let obj of audioTerms) {
            if (obj?.data?.audio && obj.data.audio.startsWith('http'))
                obj.data.audio = await this.getNewUrl(obj.data.audio);
            if (obj?.data?.captions && obj.data.captions.startsWith('http'))
                obj.data.captions = await this.getNewUrl(obj.data.captions);
        }

        const couples = this.utils.findObjectsOfType(model, "CouplesItem");
        for (let obj of couples) {
            if (Array.isArray(obj.data.couples))
                for (let couple of obj.data.couples)
                    if (couple?.image && couple.image.startsWith('http'))
                        couple.image = await this.getNewUrl(couple.image);
        }

        const imageAndSound = this.utils.findObjectsOfType(model, "ImageAndSoundItem");
        for (let obj of imageAndSound) {
            if (obj?.data?.image && obj.data.image.startsWith('http'))
                obj.data.image = await this.getNewUrl(obj.data.image);
            if (obj?.data?.audio && obj.data.audio.startsWith('http'))
                obj.data.audio = await this.getNewUrl(obj.data.audio);
            if (obj?.data?.captions && obj.data.captions.startsWith('http'))
                obj.data.captions = await this.getNewUrl(obj.data.captions);
        }

        const videos = this.utils.findObjectsOfType(model, "Video").filter(video => video.data.videourl &&
            !this.utils.isYoutubeVideoURL(video.data.videourl) &&
            !this.utils.isRelativeURL(video.data.videourl));

        for (let video of videos)
            video.data.videourl = await this.getNewUrl(video.data.videourl);
    }
}
