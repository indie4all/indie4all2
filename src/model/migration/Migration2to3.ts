import Utils from "../../Utils";

export default class Migration2to3 {

    static async run(model: any) {
        const images = Utils.findObjectsOfType(model, "SimpleImage");
        images
            .filter(image => !image.params.aspect)
            .forEach(image => image.params.aspect = 'original');

        const gapTests = Utils.findObjectsOfType(model, "GapTest");
        gapTests.forEach(gapTest => gapTest.widget = 'Test');
    }
}