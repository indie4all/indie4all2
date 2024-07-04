import Config from "../../Config";
import Utils from "../../Utils";

export default class Migration14to15 {

    private static async getNewUrl(oldURL: string): Promise<string> {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = { method: 'POST', body: JSON.stringify({ oldURL }), headers };
        return await (await fetch(Config.getMediaMigrationURL(), requestOptions)).text();
    }

    // Migrate legacy AnimationWidget to use media URLs
    static async run(model: any) {
        if (!Config.getMediaMigrationURL()) return;
        const animationElements = Utils.findObjectsOfType(model, "AnimationContainer");
        for (let obj of animationElements) {
            if (obj?.params?.image && obj.params.image.startsWith('http'))
                obj.params.image = await Migration14to15.getNewUrl(obj.params.image);
            if (Array.isArray(obj?.data) && obj.data.length > 0) {
                for (let item of obj.data) {
                    if (item?.data?.image && item?.data?.image.startsWith('http'))
                        item.data.image = await Migration14to15.getNewUrl(item.data.image);
                }
            }
        }
    }
}
