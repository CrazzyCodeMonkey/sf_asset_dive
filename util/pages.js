var fs = require('fs');
var path = require('path');
const { success, error, info, warning } = require('log-symbols');
var { parseVF } = require('./visualforce');

const debug = false;
const dir = "pages";
const ext = "page";

function loadFile(basePath, name) {
    debug ? console.log("Starting file read  ", path.join(basePath, dir, `${name}.${ext}`)) : null;
    return new Promise((res, rej) => {
        fs.readFile(path.join(basePath, dir, `${name}.${ext}`), (err, data) => {
            if (err) {
                console.error("File read error::", err);
                return rej(err);
            }
            debug ? console.log("Finish file read ", name) : null;
            return res({
                name: name,
                content: data.toString()
            });
        });
    });
}

function getIdentifiers(vfPage) {
    return parseVF(vfPage);
}

function missingController(datum) {
    console.log(info, "Checking for missing controllers");
    const classes = datum.classes.map(({ name }) => name);
    const missingControllers = [];

    datum.pages.forEach(page => {
        if (classes.indexOf(page.controller) < 0) {
            missingControllers.push(page.controller)
        };
    });

    if (missingControllers.length === 0) {
        console.log(success, "All controllers accounted for")
    } else {
        missingControllers.forEach(cont => console.log(error, "Missing controller class ", page.controller))
    }
    return datum;
}

module.exports = {
    loadFile,
    getIdentifiers,
    missingController,
}