var path = require('path');
const { success, error, info, warning } = require('log-symbols');
const { readXmlFile, parseXML } = require('./util/xml');
const {
    duplicateCheck,
    countCheck,
    checkForLablesWithoutTranslations,
    checkForTranslationsWithoutLabels,
    checkForMissingLabels
} = require('./util/Labels');

const page = require('./util/pages')
const comp = require('./util/components');
const config = require('./config.json');
const cls = require('./util/Class');
const debug = false;


pathLables = path.join(config.rootPath, "labels", "CustomLabels.labels");
pathLanguage = path.join(config.rootPath, "translations", "fr.translation");

const pLables = new Promise((res, rej) => res(pathLables));
const tLables = new Promise((res, rej) => res(pathLanguage));
const pages = new Promise((res, rej) => res(config.pages));
const comps = new Promise((res, rej) => res(config.components));
const classes = new Promise((res, rej) => res(config.classes));

console.log("Start label check process");
Promise.all([
        pLables
        .then(path => { console.log(`...reading labels ${path}`); return path; })
        .then(readXmlFile)
        .then(content => { console.log(`...parsing lables content`); return content; })
        .then(parseXML)
        .then(data => data.CustomLabels.labels)
        .then(data => data.reduce(duplicateCheck('fullName'), {}))
        .then(Object.keys)
        .then(data => { console.log('Finish label processing...'); return data; })
        .catch(e => {
            console.error('!'.repeat(50), '  ERROR Label  ', '!'.repeat(50));
            console.error(e);
        }),
        tLables
        .then(path => { console.log(`...reading translations ${path}`); return path; })
        .then(readXmlFile)
        .then(content => { console.log(`...parsing translations content`); return content; })
        .then(parseXML)
        .then(data => data.Translations.customLabels)
        .then(data => data.reduce(duplicateCheck('name'), {}))
        .then(Object.keys)
        .then(data => { console.log('Finish fr translations processing...'); return data; })
        .catch(e => {
            console.error('!'.repeat(50), '  ERROR Translation  ', '!'.repeat(50));
            console.error(e);
        }),
        pages
        .then(paths => { console.log(`...reading VFPages ${paths.length}`); return paths; })
        .then(pageNames => Promise.all(pageNames.map(pageName => page.loadFile(config.rootPath, pageName))))
        .then(contents => { console.log(`...parsing VFPages content`); return contents; })
        .then(vfPages => vfPages.map(page.getIdentifiers)),

        comps
        .then(paths => { console.log(`...reading VFComponents ${paths.length}`); return paths; })
        .then(ccNames => Promise.all(ccNames.map(ccName => comp.loadFile(config.rootPath, ccName))))
        .then(contents => { console.log(`...parsing VFComponents content`); return contents; })
        .then(vfComp => vfComp.map(page.getIdentifiers))
        .then(),

        classes
        .then(paths => { console.log(`...reading Apex Classes ${paths.length}`); return paths; })
        .then(cNames => Promise.all(cNames.map(cName => cls.loadFile(config.rootPath, cName))))
        .then(contents => { console.log(`...parsing Apex Classes content`); return contents; })
        .then(apexClass => apexClass.map(cls.getIdentifiers))
        .then()
    ])
    .then(data => {
        console.log(".".repeat(data.length), ">.  merging processes");
        const datum = {
            labels: data[0],
            trns: data[1],
            pages: data[2],
            components: data[3],
            classes: data[4]
        };

        icon = (datum.labels.length == datum.trns.length ? info : warning);
        console.log(icon, datum.labels.length, ' Unique Lables');
        console.log(icon, datum.trns.length, 'Unique Translations');

        return datum;
    })
    .then(countCheck)
    .then(checkForLablesWithoutTranslations)
    .then(checkForTranslationsWithoutLabels)
    .then(page.missingController)
    .then(comp.missingComponents)
    .then(checkForMissingLabels)
    .then(datum => console.log('Processing complete Complete'))
    .catch(e => console.error("ERROR", e));