var fs = require('fs');
var path = require('path');
const { success, error, info, warning } = require('log-symbols');
var { parseVF } = require('./visualforce');

const debug = false;
const dir = "components";
const ext = "component";

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

function getIdentifiers(vfPage) {
    return parseVF(vfPage);
}

function missingComponents(datum) {
    console.log(info, "Checking for missing Custom Compoents");
    const customComponents = datum.components.map(cc => cc.name);
    const missingComps = {};
    datum.components.forEach(component => {
        component.customComponents.forEach(subComponent => {
            if (customComponents.indexOf(subComponent) < 0) {
                if (!missingComps[subComponent]) {
                    missingComps[subComponent] = {
                        page: [],
                        component: [component.name]
                    }
                } else {
                    missingComps[subComponent].component.push(component.name);
                }

            }
        })
    });
    datum.pages.forEach(page => {
        page.customComponents.forEach(subComponent => {
            if (customComponents.indexOf(subComponent) < 0) {
                if (!missingComps[subComponent]) {
                    missingComps[subComponent] = {
                        page: [page.name],
                        component: []
                    }
                } else {
                    missingComps[subComponent].page.push(page.name);
                }

            }
        })
    });
    const comps = Object.keys(missingComps);
    if (comps.length === 0) {
        console.log(success, 'All custom components accounted for');
    } else {
        comps.forEach((comp) => {
            const c = missingComps[comp];
            if (c.page.length > 0 && c.component.length > 0) {
                console.log(error, `Missing custom component ${comp} in page(s) ${c.page.join(',')} and component(s) ${c.component.join(',')}`);
            } else if (c.page.length > 0) {
                console.log(error, `Missing custom component ${comp} in page(s) ${c.page.join(',')}`);
            } else if (c.component.length > 0) {
                console.log(error, `Missing custom component ${comp} in component(s) ${c.component.join(',')}`);
            }
        });
    }
    return datum;
}

module.exports = {
    loadFile,
    getIdentifiers,
    missingComponents
}