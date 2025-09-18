import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
// Replace with a valid JWT token
const TOKEN = ''; 

const get = async function (url: string): Promise<any> {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${TOKEN}`
        }
    };

    try { 
        const data = (await axios.request(config)).data;
        return data;
    }
    catch (error) {
        console.error("Error in GET request:", error);
        if (error.response) return error.response.data;
        return { error }
    }
}

const post = async function (url: string, data: any): Promise<any> {
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`  
         },
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
            .json((await post('http://localhost:8090/api/chatbot/editor/models/create/', req.body)));
    },
    createSection: async (req: Request, res: Response) => {
        return res
            .status(StatusCodes.OK)
            .json((await post('http://localhost:8090/api/chatbot/editor/sections/create/', req.body)));
    },
    createWidget: async (req: Request, res: Response) => {
        const type = req.params.type;
        return res
            .status(StatusCodes.OK)
            .json((await post(`http://localhost:8090/api/chatbot/editor/widgets/create/${type}`, req.body)));
    },
    getChatbots: async (req: Request, res: Response) => {
        return res
            .status(StatusCodes.OK)
            .json((await get('http://localhost:8090/api/chatbot/teacher/')));
    },
    updateModel: async (req: Request, res: Response) => {
        return res
            .status(StatusCodes.OK)
            .json((await post(`http://localhost:8090/api/chatbot/editor/models/update/`, req.body)));
    },
    updateWidget: async (req: Request, res: Response) => {
        const id = req.params.id;
        return res
            .status(StatusCodes.OK)
            .json((await post(`http://localhost:8090/api/chatbot/editor/widgets/update/`, req.body)));
    }
}