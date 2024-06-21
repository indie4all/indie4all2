import Utils from "../../Utils";
import { WidgetCalloutParams } from "../../types";

export default class Migration12to13 {

    static async run(model: any) {
        const texts = Utils.findObjectsOfType(model, "TextBlock");
        texts.filter(text => text.data?.style && text.data?.style != "default").forEach(text => {

            const child = structuredClone(text);
            delete child.data.style;

            const params: WidgetCalloutParams = {
                text: "",
                style: text.data.style,
                colorTheme: "",
                animation: "simple"
            }

            text.id = Utils.generate_uuid();
            text.widget = "Callout";
            text.data = [child];
            text.params = params;

        });

    }
}