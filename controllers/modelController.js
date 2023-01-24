
const { StatusCodes } = require('http-status-codes');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const AdmZip = require("adm-zip");
const glob = require('glob');
const { LoggerModes, JetLogger } = require('jet-logger');
const logger = JetLogger(LoggerModes.Console);
const config = require('config');


const copyAssets = function(folder, theme, mode) {
    fs.copySync(config.get("folder.assets"), folder, {overwrite: true});
    // Remove files not related to the current theme
    glob(folder + '/**/*theme*', {nocase: true}, (err, files) => {
        files
            .filter(file => !file.toLowerCase().includes(theme.toLowerCase() + "."))
            .forEach(file => fs.unlinkSync(file));
    });
    // Remove scorm libraries if the unit is not of SCORM type
    mode !== "SCORM" && fs.rmSync(folder + '/scorm/', {recursive: true, force: true});
}

const generate = function(req, res, onGenerated, mode = "Local") {
    const model = req.body
    if (Object.keys(model).length === 0 && Object.getPrototypeOf(model) === Object.prototype)
        return res.status(StatusCodes.NO_CONTENT).send();
    // Set unit mode to local
    model.mode = mode;
    // Disable analytics by default
    model.analytics = "0";
    const modelJSON = config.get("file.model.json");
    const modelXText = config.get("file.model.xtext");
    fs.writeFile(modelJSON, JSON.stringify(model), function(error) {
        if (error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        
        // Create a folder whose name is the current timestamp plus 10 minutes
        const outputFolder = `${config.get("folder.previews")}/${(new Date(Date.now() + 600000)).getTime()}`;
        exec(`java -Dfile.encoding=UTF-8 -jar ./contentgenerator.jar ${modelJSON} ${outputFolder}`, function(err, stdout, stderr) {
            fs.unlinkSync(modelJSON);
            fs.existsSync(modelXText) && fs.unlinkSync(modelXText);
            if (err) {
                logger.err(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            logger.imp(stdout);
            return onGenerated(outputFolder, model);
        });
    });
}

const onPublishUnit = function(res, output, folder, model) {
    copyAssets(`${folder}/${config.get("folder.assets")}`, model.theme, model.mode);
    const zip = new AdmZip();
    zip.addLocalFolder(folder);
    const binary = zip.toBuffer();
    fs.rmSync(folder, {recursive: true, force: true});
    return res.attachment(output).type("application/zip").status(StatusCodes.CREATED).send(binary);
}

// Dummy method that always returns OK without saving anything
exports.save = (req, res) => {
    return res
        .status(StatusCodes.OK)
        .json({ success: true, message: "OK" });
}

exports.preview = (req, res) => {
    const onGenerated = (folder) => {
        copyAssets(`${folder}/${config.get("folder.assets")}`, req.body.theme, "Local");
        return res.status(StatusCodes.OK).json({success: true, url: config.get("url.units") + "/" + folder });
    };          
    generate(req, res, onGenerated); 
}

exports.publish = (req, res) => {
    generate(req, res, onPublishUnit.bind(this, res, config.get("file.zip")));
}

exports.scorm = (req, res) => {
    generate(req, res, onPublishUnit.bind(this, res, config.get("file.scorm")), "SCORM");
};
