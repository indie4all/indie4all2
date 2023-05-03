import axios from 'axios';
import { Request, Response } from 'express';
import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);

export default {
    /**
     * 
     * @param req Request object containing the texts to translate
     * @param res Response object
     * @returns 
     */
    post: async (req: Request, res: Response) => {

        const from = req.query.from?.toString().toLowerCase();
        const to = req.query.to?.toString().toLowerCase();

        // Return the original text if the source and target languages are the same
        if (from === to) {
            res.status(200).send(req.body);
            return;
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://scgatewaydev-fwe6gvg6gzbndycj.z01.azurefd.net/api/translate/translateJSON',
            headers: {
                'X-Azure-FDID': '00028f9e-042f-4dda-a5d1-739b39c453e3',
                'Authorization': `Bearer ${process.env.TRANSLATION_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                "text": JSON.stringify(req.body),
                "sourceLanguage": req.query.from,
                "targetLanguage": req.query.to
            }
        };

        axios.request(config)
            .then((response) => res.status(200).send(response.data))
            .catch((error) => res.status(500).send(error));
    },

    status: async (req: Request, res: Response) => {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://scgatewaydev-fwe6gvg6gzbndycj.z01.azurefd.net/api/translate/translateJSON',
            headers: {
                'X-Azure-FDID': '00028f9e-042f-4dda-a5d1-739b39c453e3',
                'Authorization': `Bearer ${process.env.TRANSLATION_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: { "text": "{}", "sourceLanguage": "en", "targetLanguage": "en" }
        };
        axios.request(config)
            .then((response) => res.status(200).send(response.data))
            .catch((error) => res.status(500).send(error));
    }
}