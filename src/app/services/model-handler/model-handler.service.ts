import { inject, injectable } from "inversify";
import Config from "../../../config";
import I18nService from "../i18n/i18n.service";
import { Model } from "../../elements/model";
import ModalUnitSettings from "../../editor/modal-unit-settings/unit-settings.service";

@injectable()
export default abstract class ModelHandlerService {

    @inject(I18nService) protected i18n: I18nService;
    @inject(ModalUnitSettings) protected settings: ModalUnitSettings;

    constructor() { }

    protected abstract handle(model: Model): Promise<void>;

    async start(model: Model) {
        if (Config.isRequestAdditionalDataOnPopulate())
            await this.settings.show(model, this.i18n.value('common.unit.settings'), (model) => this.handle(model));
        else await this.handle(model);
    }
}