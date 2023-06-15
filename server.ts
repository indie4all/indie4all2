import { LoggerModes, JetLogger } from 'jet-logger';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');
const session = require('express-session')
import config from "config";
import modelRouter from "./routes/model";
import resourceRouter from "./routes/resource";
import translationRouter from "./routes/translation";
import cleanPreviewsCron from "./cron/cleanPreviews";
import { AnalyticsService } from './services/analytics/AnalyticsService';
const logger = JetLogger(LoggerModes.Console);
const app = express();
require('dotenv').config();

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
app.use(express.json({ limit: '500mb' }));
// Text/plain handler
app.use(express.text({ type: 'text/plain', limit: '50mb' }));
// Binary data handler
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));
// Access to the tool resources
app.use(express.static(config.get("folder.web")));
// Enable access to preview units
app.use(config.get("url.previews"), express.static(config.get("folder.previews")));
app.use(config.get("url.media"), express.static(config.get("folder.media")));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));
// Map root paths to their corresponding routes

app.post('/entrance', (req, res) => {
    //TODO: EXPRESS-SESSION USA POR DEFECTO ALMACENAMIENTO EN MEMORIA, NO ACONSEJABLE EN PRODUCCIÓN 
    req.session["timestamp"] = Date.now();
    res.status(200).send();
});

app.post('/exit', (req, res) => {
    const analyzer = AnalyticsService.create().entrance("/activity").setField("user_id", req.session.id);
    if (req.session["timestamp"])
        analyzer.setField("in_TIMESTAMP", req.session["timestamp"])
    analyzer.exit().send();
    res.status(200).send();
});

app.use("/model", modelRouter);
app.use("/resource", resourceRouter);
app.use("/translation", translationRouter);

app.listen(config.get("server.port"), function () {
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