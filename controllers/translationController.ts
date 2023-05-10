import { LoggerModes, JetLogger } from 'jet-logger';
import { TranslationService } from '../services/translation/TranslationService';
const logger = JetLogger(LoggerModes.Console);

export default {
    /**
     * 
     * @param req Request object containing the texts to translate
     * @param res Response object
     * @returns 
     */
    post: async (req: any, res: any) => {

        if (!req.query.from || !req.query.to)
            throw new Error("You must specify the source language (from) and the target language (to)");
        const from = req.query.from.toString().toLowerCase();
        const to = req.query.to.toString().toLowerCase();

        (req.translator as TranslationService)
            .translateJSON(req.body, from, to)
            .then((result) => res.status(200).send(result))
            .catch((error) => res.status(500).send(error));
    },

    status: async (req: any, res: any) => {
        (req.translator as TranslationService).healthCheck()
            .then((response) => res.status(200).send(response))
            .catch((error) => res.status(500).send(error));
    }
}