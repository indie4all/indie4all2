import { inject, injectable } from "inversify";
import { WidgetCalloutParams } from "../../../../types";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration12to13 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const texts = this.utils.findObjectsOfType(model, "TextBlock");
        texts.filter(text => text.data?.style && text.data?.style != "default").forEach(text => {

            const child = structuredClone(text);
            delete child.data.style;

            const params: WidgetCalloutParams = {
                text: "",
                style: text.data.style,
                colorTheme: "",
                animation: "simple"
            }

            text.id = this.utils.generate_uuid();
            text.widget = "Callout";
            text.data = [child];
            text.params = params;

        });

    }
}