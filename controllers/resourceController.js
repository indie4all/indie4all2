const axios = require('axios');

const { StatusCodes } = require('http-status-codes');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const AdmZip = require("adm-zip");
const { LoggerModes, JetLogger } = require('jet-logger');
const logger = JetLogger(LoggerModes.Console);
const config = require('config');
const sass = require('node-sass');

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
