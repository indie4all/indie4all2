import Utils from "../../Utils";

export default class Migration6to7 {

    static run(model: any) {
        const types = ['TrueFalseItem', 'GapQuestion', 'SimpleQuestion', 'TrueFalseQuestion'];
        const questionWidgets = Utils.findObjectsOfType(model, types);
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