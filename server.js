const { LoggerModes, JetLogger } = require('jet-logger');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const config = require("config");
const modelRouter = require("./routes/model");
const resourceRouter = require("./routes/resource")
const cleanPreviewsCron = require("./cron/cleanPreviews");
const logger = JetLogger(LoggerModes.Console);
const app = express();

// Enable gzip compression
app.use(compression());

// Protect the app against well known vulnerabilities
// app.use(helmet({
//     crossOriginEmbedderPolicy: false,
//     contentSecurityPolicy: {
//       directives: {
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//         "default-src": "*"["'self'", "data:", "https://www.youtube.com"],
//         "script-src": ["'self'", "'unsafe-inline'", "https://www.youtube.com"],
//       },
//     }
// }));
// Parse JSON in requests with a size limit of 500 mb
app.use(express.json({limit: '500mb'}));
// Text/plain handler
app.use(express.text({ type: 'text/plain', limit: '50mb' }));
// Binary data handler
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));
// Access to the tool resources
app.use(express.static(config.get("folder.web")));
// Enable access to preview units
app.use(config.get("url.previews"), express.static(config.get("folder.previews")));
app.use(config.get("url.media"), express.static(config.get("folder.media")));
// Map root paths to their corresponding routes
app.use("/model", modelRouter);
app.use("/resource", resourceRouter);

app.listen(config.get("server.port"), function() {
    logger.imp("---------------");
    logger.imp("SERVER STARTED AT PORT " + config.get("server.port"));
    logger.imp("---------------");
    logger.imp("Serving EDITOR on " + config.get("folder.web"));
    logger.imp("---------------");
    logger.imp("Serving PREVIEWS on " + config.get("folder.previews") + " folder ");
    logger.imp("---------------");
    logger.imp("Cleaning PREVIEWS every 10 minutes");
    cleanPreviewsCron.start();
    logger.imp("---------------");
});