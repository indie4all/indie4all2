const cron = require('node-cron');
const fs = require('fs-extra');
const config = require('config');
const { LoggerModes, JetLogger } = require('jet-logger');
const logger = JetLogger(LoggerModes.Console);

const cleanOldPreviews = function() {
    const previewsFolder = config.get("folder.previews");
    fs.readdir(previewsFolder, {withFileTypes: true}, (err, files) => {
        logger.imp("Cleaning old previews...");
        if (err) {
            logger.err("Could not read directory: " + previewsFolder);
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
            .forEach(dir => fs.rm(previewsFolder + "/" + dir.name, {recursive: true, force: true}));
    });
}

exports.start = () => {
    const scheduled = cron.schedule('*/10 * * * *', cleanOldPreviews);
    scheduled.start();
}