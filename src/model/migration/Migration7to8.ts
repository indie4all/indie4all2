import Utils from "../../Utils";

export default class Migration7to8 {

    static run(model: any) {
        const types = ['Video', 'ImageAndSoundItem', 'AudioTermItem'];
        const widgetAudioCaptions = Utils.findObjectsOfType(model, types);
        widgetAudioCaptions.forEach(instance => {
            if (typeof instance.data.captions !== "string")
                instance.data.captions = "";
            if (instance.widget === "Video" && typeof instance.data.descriptions !== "string")
                instance.data.descriptions = "";
        });
    }
}