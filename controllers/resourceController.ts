import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs-extra';
import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import config from 'config';
import crypto from 'crypto';
import { Request, Response } from 'express';

export default {
    get: async (req: Request, res: Response) => {
        const config: AxiosRequestConfig = {
            method: 'get',
            responseType: 'arraybuffer',
            url: req.query.resource as string,
            headers: { 'Accept': '*/*', 'Connection': 'keep-alive' }
        };
        const response = await axios(config);
        res.set(response.headers);
        res.send(response.data);
    },
    post: async (req: Request, res: Response) => {
        const blob = req.body;
        const hash = crypto.createHash('sha256').update(blob).digest('hex');
        await fs.writeFile(config.get("folder.media") + '/' + hash, blob);
        res.status(200).send(req.protocol + '://' + req.get('host') + config.get("url.media") + '/' + hash);
    }
}