import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';

export default {
    get: (req: Request, res: Response) => {

        const trueFalseQuestions = [...Array(10)].map((_, idx) => ({
            "id": "TrueFalse-" + idx,
            "type": "TrueFalse",
            "text": "True/False Question " + idx,
            "answers": [],
            "correct": true,
            "tags": ["True", "False"],
            "group": {
                "key": idx.toString(),
                "name": idx.toString()
            }
        }));

        const singleAnswerQuestions = [...Array(10)].map((_, idx) => ({
            "id": "Single-" + idx,
            "type": "SingleAnswer",
            "text": "SingleAnswer Question " + idx,
            "answers": [{ "text": "Yes", "correct": true }, { "text": "No", "correct": false }],
            "correct": false,
            "tags": ["Single", "Answer"],
            "group": {
                "key": idx.toString(),
                "name": idx.toString()
            }
        }));

        const multipleAnswerQuestions = [...Array(10)].map((_, idx) => ({
            "id": "Multiple-" + idx,
            "type": "MultipleAnswer",
            "text": "MultipleAnswer Question " + idx,
            "answers": [{ "text": "Yes", "correct": true }, { "text": "No", "correct": false }, { "text": "Maybe", "correct": true }],
            "correct": false,
            "tags": ["Multiple", "Answer"],
            "group": {
                "key": idx.toString(),
                "name": idx.toString()
            }
        }));

        res.send([...trueFalseQuestions, ...singleAnswerQuestions, ...multipleAnswerQuestions]);
    }
}