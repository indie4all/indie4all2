import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration11to12 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const texts = this.utils.findObjectsOfType(model, "TextBlock");
        texts.filter(text => !text.data?.style).forEach(text => text.data.style = 'default');
        const columns = this.utils.findObjectsOfType(model, "ColumnLayout");
        // Cast ColumnLayout to TwoColumnsLayout / ThreeColumnsLayout / FourColumnsLayout depending on the 
        // number of columns
        columns.forEach(column => {
            if (!column.params.columns)
                throw new Error("Number of columns not known");
            const columns = Math.round(column.params.columns);
            delete column.params.columns;
            switch (columns) {
                case 2:
                    column.widget = "TwoColumnsLayout";
                    column.params.firstColumnWidth = "6";
                    break;
                case 3: column.widget = "ThreeColumnsLayout"; break;
                case 4: column.widget = "FourColumnsLayout"; break;
                default: throw new Error("Unsupported number of columns.")
            }
        });
    }
}