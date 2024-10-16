import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import axios, { AxiosError } from 'axios';

const TOKEN = "";

const getFilesAndFolders = async (token: string, folderId: string, pageSize: number, currentPage: number) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://scgatewaydev-fwe6gvg6gzbndycj.z01.azurefd.net/api/media/author/${folderId}?fl_page=${currentPage}&fl_size=${pageSize}`,
        headers: {
            'X-Azure-FDID': '00028f9e-042f-4dda-a5d1-739b39c453e3',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: {}
    };
    const response = await axios.request(config);
    return response.data;
}

const getBytes = async (token: string, mediaFileId: string, thumbnail = false) => {
    const regex = /([a-f0-9]{32})(\.[a-f0-9]{1,5})?/;
    const fileId = regex.test(mediaFileId) ? (mediaFileId.match(regex) as string[])[1] : mediaFileId;
    let url = `https://scgatewaydev-fwe6gvg6gzbndycj.z01.azurefd.net/api/media/authormedia/image/${fileId}`;
    if (thumbnail) url += "/128";
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url,
        headers: {
            'X-Azure-FDID': '00028f9e-042f-4dda-a5d1-739b39c453e3',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        responseType: 'arraybuffer',
        data: {}
    };
    // @ts-ignore
    const response = await axios.request(config);
    return response;
}

/**
 * Handle connection errors
 * @param res ExpressJS response object 
 * @param error Exception error
 */
const handleConnectionError = function (res: Response, error: Error) {
    logger.err(error);
    const axiosErr = error as AxiosError;
    axiosErr.response ?
        res.status(axiosErr.response.status).json({ error: axiosErr.code }) :
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
}

export default {
    get: async (req: Request, res: Response) => {
        const PAGE_SIZE = 18;

        const currentPage = parseInt(req.query.page as string ?? "0");
        let folderId = req.params.folderId ?? "";
        if (folderId && !/[a-f0-9]{32}/.test(folderId)) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid folder id" });
            return;
        }
        try {
            const content = await getFilesAndFolders(TOKEN, folderId, PAGE_SIZE, currentPage);
            res.json(content);
        } catch (error) {
            handleConnectionError(res, error);
        }
    },
    thumbnail: async (req: Request, res: Response) => {
        let fileId = req.params.fileId;
        if (!/[a-f0-9]{32}/.test(fileId)) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid file id" });
            return;
        }
        try {
            const response = await getBytes(TOKEN, fileId, true)
            //@ts-ignore
            res.writeHead(200, response.headers)
            res.end(response.data, 'binary');
        } catch (error) {
            handleConnectionError(res, error);
        }
    },
    content: async (req: Request, res: Response) => {
        let fileId = req.params.fileId;
        if (!/[a-f0-9]{32}/.test(fileId)) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid file id" });
            return;
        }
        try {
            const response = await getBytes(TOKEN, fileId)
            //@ts-ignore
            res.writeHead(200, response.headers)
            res.end(response.data, 'binary');
        } catch (error) {
            handleConnectionError(res, error);
        }
    }
}