const { LoggerModes, JetLogger } = require('jet-logger');
const { StatusCodes } = require('http-status-codes');
const exec = require('child_process').exec;
const express = require('express');
const fs = require('fs-extra');
const AdmZip = require("adm-zip");
const glob = require('glob');
const cron = require('node-cron');

const WEB = "web/";
const logger = JetLogger(LoggerModes.Console);
const app = express();
const INPUT_MODEL = "output.json"
const OUTPUT_MODEL = "output.upctforma"
const ASSETS_FOLDER = "assets"
const OUTPUT_FOLDER = "preview"
const UNITS_FOLDER = "units";
const OUTPUT_ZIPFILE = `generated.zip`

const copyAssets = function(folder, theme) {
    fs.copySync(ASSETS_FOLDER, folder, {overwrite: true});
    // Remove files not related to the current theme
    glob(folder + '/**/*theme*', {nocase: true}, (err, files) => {
        files
            .filter(file => !file.toLowerCase().includes(theme.toLowerCase() + "."))
            .forEach(file => fs.unlinkSync(file));
    });
}

const cleanOldPreviews = function() {

    fs.readdir(OUTPUT_FOLDER, {withFileTypes: true}, (err, files) => {
        logger.imp("Cleaning old previews...");
        if (err) {
            logger.err("Could not read directory: " + OUTPUT_FOLDER);
            logger.err(err);
            return;
        }

        files
            // Only directories
            .filter(file => file.isDirectory)
            // Whose name is numeric
            .filter(dir => /^\d+$/.test(dir.name))
            // And whose timestamp is lesser than now
            .filter(dir => parseInt(dir.name) <= Date.now())
            // Delete them
            .forEach(dir => fs.rm(OUTPUT_FOLDER + "/" + dir.name, {recursive: true, force: true}));
    });
}


const generate = function(req, res, onGenerated) {
    const model = req.body
    if (Object.keys(model).length === 0 && Object.getPrototypeOf(model) === Object.prototype)
        return res.status(StatusCodes.NO_CONTENT).send();
    // Set unit mode to local
    model.mode = "Local";
    // Disable analytics by default
    model.analytics = "0";
    fs.writeFile(INPUT_MODEL, JSON.stringify(model), function(error) {
        if (error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        
        // Create a folder whose name is the current timestamp plus 10 minutes
        const OUTPUT = `${OUTPUT_FOLDER}/${(new Date(Date.now() + 600000)).getTime()}`;
        exec(`java -Dfile.encoding=UTF-8 -jar ./contentgenerator.jar ${INPUT_MODEL} ${OUTPUT}`, function(err, stdout, stderr) {
            fs.unlinkSync(INPUT_MODEL);
            fs.existsSync(OUTPUT_MODEL) && fs.unlinkSync(OUTPUT_MODEL);
            if (err) {
                logger.err(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            logger.imp(stdout);
            return onGenerated(OUTPUT);
        });
    });
}

app.use(express.static(WEB));
// Enable access to preview units
app.use(`/${UNITS_FOLDER}/preview`, express.static(OUTPUT_FOLDER));
// Parse JSON from POST body (for future validation)
app.use(express.json({limit: '500mb'}));

app.put('/model/preview', function(req, res) {
    const onGenerated = (folder) => {
        copyAssets(`${folder}/${ASSETS_FOLDER}`, req.body.theme);
        return res.type("text/uri").send(UNITS_FOLDER + "/" + folder);
    };          
    generate(req, res, onGenerated); 
    
});

app.put('/model/publish', function(req, res) {
    const onGenerated = (folder) => {
        copyAssets(`${folder}/${ASSETS_FOLDER}`, req.body.theme);
        const zip = new AdmZip();
        zip.addLocalFolder(folder);
        const binary = zip.toBuffer();
        fs.rmSync(folder, {recursive: true, force: true});
        return res.attachment(OUTPUT_ZIPFILE).type("application/zip").status(StatusCodes.CREATED).send(binary);
    };          
    generate(req, res, onGenerated);    
});

app.listen(8000, function() {
    logger.imp("---------------");
    logger.imp("SERVER STARTED AT " + 8000);
    logger.imp("---------------");
    logger.imp("Serving EDITOR on " + WEB);
    logger.imp("---------------");
    logger.imp("Serving PREVIEWS on " + OUTPUT_FOLDER + " folder ");
    logger.imp("---------------");
    logger.imp("Cleaning PREVIEWS every 10 minutes");
    cron.schedule('*/10 * * * *', cleanOldPreviews);
    logger.imp("---------------");
});