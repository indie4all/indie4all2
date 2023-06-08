import Utils from "../../Utils";

export default class MigrationEvaluationToContent {

    private static parseQuestion(question: any): any {
        switch (question.type) {
            case "MultipleAnswer":
                return {
                    id: Utils.generate_uuid(),
                    widget: "MultipleQuestion",
                    data: {
                        question: question.text,
                        answers: question.answers
                    }

                }
            case "SingleAnswer":
                return {
                    id: Utils.generate_uuid(),
                    widget: "SimpleQuestion",
                    data: {
                        question: question.text,
                        answers: question.answers
                    }

                }
            case "TrueFalse":
                return {
                    id: Utils.generate_uuid(),
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

    static run(model: any) {

        const questions = [...model.evaluation];

        const testId = Utils.generate_uuid();

        model.sections = [{
            id: Utils.generate_uuid(),
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