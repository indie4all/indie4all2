import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

const post = async function (url: string, data: any): Promise<any> {
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: { 'Content-Type': 'application/json' },
        data: data
    };

    try { return (await axios.request(config)).data; }
    catch (error) {
        if (error.response) return error.response.data;
        return { error }
    }

}

export default {
    createModel: async (req: Request, res: Response) => {
        return res
            .status(StatusCodes.OK)
            .json((await post('http://localhost:8090/api/ai/models/create/structured', req.body)));
    },
    createSection: async (req: Request, res: Response) => {
        return res
            .status(StatusCodes.OK)
            .json((await post('http://localhost:8090/api/ai/sections/create/structured', req.body)));
    },
    createWidget: async (req: Request, res: Response) => {
        const type = req.params.type;
        return res
            .status(StatusCodes.OK)
            .json((await post(`http://localhost:8090/api/ai/widgets/create/structured/${type}`, req.body)));
    },
    updateWidget: async (req: Request, res: Response) => {
        const id = req.params.id;
        return res
            .status(StatusCodes.OK)
            .json((await post(`http://localhost:8090/api/ai/widgets/update/structured/${id}`, req.body)));
    }
}