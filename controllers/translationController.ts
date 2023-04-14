import axios from 'axios';
import { Request, Response } from 'express';
import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);

export default {
    post: async (req: Request, res: Response) => {
        res.status(200).send(req.body);
    }
}
