module.exports = function () {
    return new Promise(function (resolve, reject) {
        const jsdom = require("jsdom");
        const { JSDOM } = jsdom;
        const virtualConsole = new jsdom.VirtualConsole();

        JSDOM.fromFile('./web/index.html', { runScripts: "dangerously", resources: "usable", virtualConsole: virtualConsole }).then((dom) => {
            dom.window.onload = () => {
                resolve(dom.window);
            }

        }).catch(err => {
            reject(err);
        })
    });
};