import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class Migration6to7 extends Migration {

    @inject(UtilsService) private utils: UtilsService;

    async run(model: any) {
        const types = ['TrueFalseItem', 'GapQuestion', 'SimpleQuestion', 'TrueFalseQuestion', 'MultipleQuestion'];
        const questionWidgets = this.utils.findObjectsOfType(model, types);
        questionWidgets.forEach(widget => {
            if (typeof widget.data?.feedback !== "object")
                widget.data.feedback = {};
            if (typeof widget.data.feedback.positive !== "string")
                widget.data.feedback.positive = '';
            if (typeof widget.data.feedback.negative !== "string")
                widget.data.feedback.negative = '';
        });
    }
}