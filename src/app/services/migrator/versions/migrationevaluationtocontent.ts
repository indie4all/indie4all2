import { inject, injectable } from "inversify";
import Migration from "./migration";
import UtilsService from "../../utils/utils.service";

@injectable()
export default class MigrationEvaluationToContent extends Migration {

    constructor(@inject(UtilsService) private utils: UtilsService) {
        super();
    }

    private parseQuestion(question: any): any {
        switch (question.type) {
            case "MultipleAnswer":
                return {
                    id: this.utils.generate_uuid(),
                    widget: "MultipleQuestion",
                    data: {
                        question: question.text,
                        answers: question.answers
                    }

                }
            case "SingleAnswer":
                return {
                    id: this.utils.generate_uuid(),
                    widget: "SimpleQuestion",
                    data: {
                        question: question.text,
                        answers: question.answers
                    }

                }
            case "TrueFalse":
                return {
                    id: this.utils.generate_uuid(),
                    widget: "TrueFalseQuestion",
                    data: {
                        question: question.text,
                        answer: question.correct,

                    }
                }
            case "FillingAnswer":
                throw new Error('This type of question should not be used');
        }
    }

    async run(model: any) {

        const questions = [...model.evaluation];

        const testId = this.utils.generate_uuid();

        model.sections = [{
            id: this.utils.generate_uuid(),
            bookmark: "Section",
            name: "Section",
            widget: "Section",
            data: [{
                id: testId,
                widget: "Test",
                params: { help: "", name: "Test-" + testId },
                data: questions.map(question => this.parseQuestion(question))
            }]
        }];
    }
}