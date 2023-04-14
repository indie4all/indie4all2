import cron from 'node-cron';
import fs from 'fs-extra';
import config from 'config';
import { LoggerModes, JetLogger } from 'jet-logger';
const logger = JetLogger(LoggerModes.Console);

const cleanOldPreviews = function () {
    const previewsFolder = config.get<string>("folder.previews");
    fs.readdir(previewsFolder, { withFileTypes: true }, (err, files) => {
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
            .forEach(dir => fs.rm(previewsFolder + "/" + dir.name, { recursive: true, force: true }));
    });
}

export default {
    start: () => {
        const scheduled = cron.schedule('*/10 * * * *', cleanOldPreviews);
        scheduled.start();
    }
}