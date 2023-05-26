
import { StatusCodes } from 'http-status-codes';
const exec = require('child_process').exec;
import fs from 'fs-extra';
import AdmZip from "adm-zip";
import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);
import config from 'config';
import sass from 'node-sass';
import { Request, Response } from 'express';

const VALID_COVER_PATTERN = /^data:([-\w.]+\/[-\w.+]+)?;base64,[A-Za-z0-9+/]*={0,2}$/;
const VALID_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const copyAssets = async function (folder: string, color: string, cover: string, mode: string) {

    logger.info("Copying unit assets into the destination directory");
    await fs.copy(config.get("folder.assets"), folder, { overwrite: true })
    logger.info("Generating custom theme");
    // Generate the css of the current theme
    const themeTemplate = './templates/theme.scss';
    const realColor = VALID_COLOR_PATTERN.test(color) ? color : '#000000';
    const realCover = VALID_COVER_PATTERN.test(cover) ? cover : 'data:null';
    const data = `$base-color: ${realColor}; $base-url: "${realCover}"; @import '${themeTemplate}';`
    const css = await new Promise((resolve) =>
        sass.render({ data, includePaths: [themeTemplate], outputStyle: 'compressed' }, (err, result) => { resolve(result.css) }));
    await fs.writeFile(folder + '/generator/content/v4-7-2/css/stylesCustom.min.css', css as string);
    // Remove scorm libraries if the unit is not of SCORM type
    if (mode !== "SCORM") {
        logger.info("Removing scorm-related assets");
        await fs.rm(folder + '/scorm/', { recursive: true, force: true });
    }
}

const generate = function (req: Request, res: Response, onGenerated: Function, mode = "Local") {

    logger.info("Generating unit in " + mode + " mode");
    const model = req.body as any;
    if (Object.keys(model).length === 0 && Object.getPrototypeOf(model) === Object.prototype)
        return res.status(StatusCodes.NO_CONTENT).send();
    // Set unit mode to local
    model.mode = mode;
    // Set unit theme to Custom
    model.theme = "Custom";
    // Disable analytics by default
    model.analytics = "0";
    const timestamp = (new Date(Date.now() + 600000)).getTime();
    const modelJSON = timestamp + "_" + config.get("file.model.json");
    const modelXText = timestamp + "_" + config.get("file.model.xtext");
    fs.writeFile(modelJSON, JSON.stringify(model), function (error) {
        if (error) {
            logger.err(error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }

        // Create a folder whose name is the current timestamp plus 10 minutes
        const outputFolder = `${config.get("folder.previews")}/${timestamp}`;
        exec(`java -Dfile.encoding=UTF-8 -jar ./contentgenerator.jar ${modelJSON} ${outputFolder}`, function (err, stdout, stderr) {
            fs.unlink(modelJSON);
            fs.exists(modelXText).then(() => fs.unlink(modelXText));
            if (err) {
                logger.err(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            logger.imp("\n" + stdout);
            onGenerated(outputFolder, model);
        });
    });
}

const onPublishUnit = async function (res: Response, output: string, folder: string, model: any) {
    await copyAssets(`${folder}/${config.get("folder.assets")}`, model.color, model.cover, model.mode);
    logger.info("Zipping the generated unit folder");
    const zip = new AdmZip();
    zip.addLocalFolder(folder);
    const binary = zip.toBuffer();
    fs.rm(folder, { recursive: true, force: true });
    return res.attachment(output).type("application/zip").status(StatusCodes.CREATED).send(binary);
}

export default {
    // Dummy method that always returns OK without saving anything
    save: (req: Request, res: Response) => {
        return res
            .status(StatusCodes.OK)
            .json({ success: true, message: "OK" });
    },
    preview: (req: Request, res: Response) => {
        const model = req.body as any;
        const onGenerated = async (folder) => {
            await copyAssets(`${folder}/${config.get("folder.assets")}`, model.color, model.cover, model.mode);
            return res.status(StatusCodes.OK).json({ success: true, url: folder });
        };
        generate(req, res, onGenerated, model.mode);
    },
    publish: (req: Request, res: Response) => {
        const model = req.body as any;
        generate(req, res, onPublishUnit.bind(this, res, config.get("file.zip")), model.mode);
    },
    scorm: (req: Request, res: Response) => {
        generate(req, res, onPublishUnit.bind(this, res, config.get("file.scorm")), "SCORM");
    }
}