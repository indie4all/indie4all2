const { LoggerModes, JetLogger } = require('jet-logger');
const { StatusCodes } = require('http-status-codes');
const exec = require('child_process').exec;
const express = require('express');
const fs = require('fs-extra');
const AdmZip = require("adm-zip");

const WEB = "web/";
const logger = JetLogger(LoggerModes.Console);
const app = express();
const INPUT_MODEL = "output.json"
const OUTPUT_MODEL = "output.upctforma"
const ASSETS_FOLDER = "assets"
const OUTPUT_FOLDER = "preview"
const UNITS_FOLDER = "units";
const OUTPUT_ZIPFILE = `generated.zip`

app.use(express.static(WEB));
app.use(`/${UNITS_FOLDER}/preview`, express.static(OUTPUT_FOLDER));
// Parse JSON from POST body (for future validation)
app.use(express.json({limit: '500mb'}));

const generate = function(req, res, onGenerated) {
    const model = req.body
    if (Object.keys(model).length === 0 && Object.getPrototypeOf(model) === Object.prototype)
        return res.status(StatusCodes.NO_CONTENT).send();
    // Do additional logic / validation here
    // ...
    // Set unit mode to local
    model.mode = "Local";
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

app.put('/model/preview', function(req, res) {
    const onGenerated = (folder) => {
        fs.copySync(ASSETS_FOLDER, `${folder}/${ASSETS_FOLDER}`, {overwrite: true});
        return res.type("text/uri").send(UNITS_FOLDER + "/" + folder);
    };          
    generate(req, res, onGenerated); 
    
});

app.put('/model/publish', function(req, res) {
    const onGenerated = (folder) => {
        fs.copySync(ASSETS_FOLDER, `${folder}/${ASSETS_FOLDER}`, {overwrite: true});
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
    logger.imp("serving " + WEB);
    logger.imp("---------------");
});