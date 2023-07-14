import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';

export default {
    get: (req: Request, res: Response) => {
        const obj = {
            id: "3210555b8c10",
            widget: "TextBlock",
            data: {
                "text": "<p>Example text</p>"
            }
        };

        const widget = {
            name: "Widget 1",
            description: "This is a template widget for test purposes only",
            author: { completeName: "Javier" },
            type: "Callout",
            content: JSON.stringify(obj)
        }

        const json: Object[] = []
        for (let i = 0; i < 100; i++) {
            let elem = { ...widget };
            elem.name = "Widget " + i;
            json.push(elem);
        }

        res.send(json);
    }
}