import { inject, injectable } from "inversify";
import Migration from "./migration";
import I18nService from "../../i18n/i18n.service";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration5to6 extends Migration {

    public constructor(
        @inject(I18nService) private i18n: I18nService,
        @inject(UtilsService) private utils: UtilsService) {
        super();
    }

    async run(model: any) {
        const types = ['ChooseOption', 'CouplesItem', 'Image', 'ChooseOption',
            'ImageAndSoundItem', 'ImageAndText', 'SchemaItem', 'SimpleImage']

        const imageWidgets = this.utils.findObjectsOfType(model, types);
        imageWidgets
            .filter(imageWidget => !imageWidget.data.alt)
            .forEach(imageWidget =>
                imageWidget.data.alt = this.i18n.value("errors.common.alt.invalid")
            );
    }
}