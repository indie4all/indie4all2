import I18nService from "../app/services/i18n/i18n.service";
import ContainerManager from "../container.manager";
export default function (query) {
    return ContainerManager.instance.get(I18nService).value(query);
}