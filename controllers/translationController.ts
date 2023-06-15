import { LoggerModes, JetLogger } from 'jet-logger';
import { TranslationService } from '../services/translation/TranslationService';
import { AnalyticsService } from '../services/analytics/AnalyticsService';
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

        const translator:TranslationService = res.locals.translator;
        const analyzer:AnalyticsService = res.locals.analyzer;
        translator
            .translateJSON(req.body, from, to)
            .then((result) => {
                const size : number = translator.translationLength(result);
                analyzer.setField("length", size).exit().send();
                res.status(200).send(result);
            })
            .catch((error) => {
                //TODO: PENSAR ANALIZAR EL ERROR
                 analyzer.exit().send();
                res.status(500).send(error)
            });
    },

    status: async (req: any, res: any) => {
        (res.locals.translator as TranslationService).healthCheck()
            .then((response) => res.status(200).send(response))
            .catch((error) => res.status(500).send(error));
    }
}