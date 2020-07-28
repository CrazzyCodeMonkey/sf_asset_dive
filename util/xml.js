var parseString = require('xml2js').parseString;
var fs = require('fs');

const debug = false;


function readXmlFile(path) {
    debug ? console.log(`Starting file read: ${path}`) : null;
    return new Promise((res, rej) => {
        fs.readFile(path.toString(), (err, data) => {
            if (err) {
                console.error("File read error::", err);
                return rej(err);
            }
            debug ? console.log('Finish reading file') : null;
            return res(data.toString());
        });
    });
}

function parseXML(data) {
    debug ? console.log('Starting XML Parse') : null;
    return new Promise((res, rej) => {
        parseString(data, (err, xml) => {
            if (err) {
                console.error("XML parse", err);
                return rej(err);
            }
            debug ? console.log('Finish parsing XML') : null;
            return res(xml);
        })
    })
}

module.exports = {
    readXmlFile,
    parseXML
}