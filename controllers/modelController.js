
const { StatusCodes } = require('http-status-codes');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const AdmZip = require("adm-zip");
const { LoggerModes, JetLogger } = require('jet-logger');
const logger = JetLogger(LoggerModes.Console);
const config = require('config');
const sass = require('node-sass');

const VALID_COVER_PATTERN = /^data:([-\w.]+\/[-\w.+]+)?;base64,([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
const VALID_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

const copyAssets = async function(folder, color, cover, mode) {
    await fs.copy(config.get("folder.assets"), folder, {overwrite: true})
    // Generate the css of the current theme
    const themeTemplate = './templates/theme.scss';
    const realColor = VALID_COLOR_PATTERN.test(color) ? color : '#000000';
    const realCover = VALID_COVER_PATTERN.test(cover) ? cover : 'data:null';
    const data = `$base-color: ${realColor}; $base-url: "${realCover}"; @import '${themeTemplate}';`
    const css = await new Promise((resolve) => 
        sass.render({data, includePaths: [themeTemplate], outputStyle: 'compressed'}, (err, result) => { resolve(result.css)}));
    await fs.writeFile(folder + '/generator/content/v4-7-1/css/stylesCustom.min.css', css);
    // Remove scorm libraries if the unit is not of SCORM type
    if (mode !== "SCORM")
        await fs.rm(folder + '/scorm/', {recursive: true, force: true});
}

const generate = function(req, res, onGenerated, mode = "Local") {
    const model = req.body
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
    fs.writeFile(modelJSON, JSON.stringify(model), function(error) {
        if (error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        
        // Create a folder whose name is the current timestamp plus 10 minutes
        const outputFolder = `${config.get("folder.previews")}/${timestamp}`;
        exec(`java -Dfile.encoding=UTF-8 -jar ./contentgenerator.jar ${modelJSON} ${outputFolder}`, function(err, stdout, stderr) {
            fs.unlink(modelJSON);
            fs.exists(modelXText).then(() => fs.unlink(modelXText));
            if (err) {
                logger.err(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            logger.imp(stdout);
            onGenerated(outputFolder, model);
        });
    });
}

const onPublishUnit = async function(res, output, folder, model) {
    await copyAssets(`${folder}/${config.get("folder.assets")}`, model.color, model.cover, model.mode);
    const zip = new AdmZip();
    zip.addLocalFolder(folder);
    const binary = zip.toBuffer();
    fs.rm(folder, {recursive: true, force: true});
    return res.attachment(output).type("application/zip").status(StatusCodes.CREATED).send(binary);
}

// Dummy method that always returns OK without saving anything
exports.save = (req, res) => {
    return res
        .status(StatusCodes.OK)
        .json({ success: true, message: "OK" });
}

exports.preview = (req, res) => {
    const onGenerated = async (folder) => {
        await copyAssets(`${folder}/${config.get("folder.assets")}`, req.body.color, req.body.cover, req.body.mode);
        return res.status(StatusCodes.OK).json({success: true, url: config.get("url.units") + "/" + folder });
    };          
    generate(req, res, onGenerated, req.body.mode); 
}

exports.publish = (req, res) => {
    generate(req, res, onPublishUnit.bind(this, res, config.get("file.zip")), req.body.mode);
}

exports.scorm = (req, res) => {
    generate(req, res, onPublishUnit.bind(this, res, config.get("file.scorm")), "SCORM");
};
