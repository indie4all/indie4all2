const axios = require('axios');
const fs = require('fs-extra');
const { LoggerModes, JetLogger } = require('jet-logger');
const logger = JetLogger(LoggerModes.Console);
const config = require('config');
const crypto = require('crypto');

exports.get = async (req, res) => {
    const config = {
        method: 'get',
        responseType: 'arraybuffer',
        url: req.query.resource,
        headers: { 'Accept': '*/*', 'Connection': 'keep-alive' }
    };
    const response = await axios(config);
    res.set(response.headers);
    res.send(response.data);
};

exports.post = async (req, res) => {
    const blob = req.body;
    const hash = crypto.createHash('sha256').update(blob).digest('hex');
    await fs.writeFile(config.get("folder.media") + '/' + hash, blob);
    res.status(200).send(req.protocol + '://' + req.get('host') + config.get("url.media") + '/' + hash);
};
