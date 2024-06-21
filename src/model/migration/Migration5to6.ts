import Utils from "../../Utils";
import I18n from "../../I18n";

export default class Migration5to6 {

    static async run(model: any) {
        const types = ['ChooseOption', 'CouplesItem', 'Image', 'ChooseOption',
            'ImageAndSoundItem', 'ImageAndText', 'SchemaItem', 'SimpleImage']

        const imageWidgets = Utils.findObjectsOfType(model, types);
        imageWidgets
            .filter(imageWidget => !imageWidget.data.alt)
            .forEach(imageWidget =>
                imageWidget.data.alt = I18n.getInstance().value("errors.common.alt.invalid")
            );
    }
}