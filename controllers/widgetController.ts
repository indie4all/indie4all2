import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs-extra';
import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import config from 'config';
import crypto from 'crypto';
import { Request, Response } from 'express';

export default {
    get: (req: Request, res: Response) => {
        const obj = {
            id: "3210555b8c10",
            widget: "TextBlock",
            data: {
                "text": "<p>eeeeeee</p>"
            }
        };

        const widget = {
            title: "Widget 1",
            desc: "El primer widget del banco",
            author: "Javier",
            widgetElement: "Callout",
            data: JSON.stringify(obj)
        }

        const json: Object[] = []

        for (let i = 0; i < 100; i++) {
            json.push(widget);
        }

        json.push({
            title: "Widget 2",
            desc: "El primer widget del banco",
            author: "Javier",
            widgetElement: "TextBlock",
            data: JSON.stringify(obj)
        })

        res.send(json);
    }
}