var fs = require('fs');
var path = require('path');
var { parseVF } = require('./visualforce');

const debug = false;
const dir = "classes";
const ext = "cls";
const regExExtend = /class [a-zA-Z0-9]* extends ([a-zA-Z0-9]*) {/;

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
                name,
                content: data.toString()
            });
        });
    });
}

function getIdentifiers({ name, content }) {
    return {
        name,
        extendedClass: getExtendedClass(content),
    };
}

function getExtendedClass(content) {
    const extendedClass = content.match(regExExtend);
    return (extendedClass ? extendedClass[1] : '');
}

function missingClasses(datum) {
    console.log("Checking for missing Classes");
    const classes = datum.classes.map(c => c.name);
    const missingClass = {};
    //console.log(datum);
}

module.exports = {
    loadFile,
    getIdentifiers,
    missingClasses
}