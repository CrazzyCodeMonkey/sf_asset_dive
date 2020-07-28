const { success, error, info, warning } = require('log-symbols');
const debug = false;

function duplicateCheck(field) {
    debug ? console.log('Starting dupliate check') : null;
    return (names, curr) => {
        labelName = curr[field][0];
        if (!names[labelName]) {
            return {
                ...names,
                [labelName]: true
            };
        } else {
            console.error(`${'!'.repeat(50)} Duplicate found ${labelName} ${'!'.repeat(50)}`);
            return names;
        }
    }
}

function countCheck(datum) {
    if (datum.labels.length > datum.trns.length) {
        console.error(error, `More Lables than Translations (${datum.labels.length - datum.trns.length})`);
    } else if (datum.labels.length < datum.trns.length) {
        console.error(error, `More Translations than Lables (${datum.trns.length - datum.labels.length})`);
    } else {
        console.log(success, 'Translation and Label count match', '~'.repeat(50));
    }
    return datum;
}

function checkForLablesWithoutTranslations(datum) {
    const missing = datum.labels.filter(key => datum.trns.indexOf(key) == -1)
        //.forEach(key => console.log('!'.repeat(50), `Translation not included for ${key}`));
    if (missing.length > 0) {
        console.log(`${error} ${missing.length} Labels without Translations`);
        //fs.writeFile('missingTranslations.txt', missing.join('\n'), () => )
    }
    return datum
}

function checkForTranslationsWithoutLabels(datum) {
    const missing = datum.trns.filter(key => datum.labels.indexOf(key) == -1)
        //.forEach(key => console.log('!'.repeat(50), `Language not included for ${key}`));
    console.log(`${error} ${missing.length} Translations without Labels`);
    return datum
}

function checkForMissingLabels(datum) {
    console.log(info, "Checking for missing Labels");
    const missingLabels = {};
    datum.components.forEach(component => {
        component.labels.forEach(label => {
            if (datum.labels.indexOf(label) < 0) {
                if (!missingLabels[label]) {
                    missingLabels[label] = {
                        page: [],
                        component: [component]
                    }
                } else {
                    missingLabels[label].component.push(component);
                }

            }
        })
    });
    datum.pages.forEach(page => {
        page.labels.forEach(label => {
            if (datum.labels.indexOf(label) < 0) {
                if (!missingLabels[label]) {
                    missingLabels[label] = {
                        page: [page],
                        component: []
                    }
                } else {
                    missingLabels[label].page.push(page);
                }

            }
        })
    });
    const lbls = Object.keys(missingLabels);
    if (lbls.length === 0) {
        console.log(success, "All labels accounted for")
    } else {
        lbls.forEach((comp) => {
            const l = missingLabels[comp];
            if (l.page.length > 0 && l.component.length > 0) {
                console.log(error, `Missing labels ${comp} in page(s) ${l.page.join(',')} and component(s) ${l.component.join(',')}`);
            } else if (l.page.length > 0) {
                console.log(error, `Missing labels ${comp} in page(s) ${l.page.join(',')}`);
            } else {
                console.log(error, `Missing labels ${comp} in component(s) ${l.component.join(',')}`);
            }
        });
    }
    return datum;
}

module.exports = {
    duplicateCheck,
    countCheck,
    checkForLablesWithoutTranslations,
    checkForTranslationsWithoutLabels,
    checkForMissingLabels,
};