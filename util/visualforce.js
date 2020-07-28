const regExCC = /<c:([a-zA-Z0-9_]*)/g;
const regExLbl = /\$Label.([a-zA-Z0-9_]*)/g;
const regExCont = /controller=["']([a-zA-Z0-9_]*)["']/;

function parseVF(vf) {
    const { name, content } = vf;
    return {
        name,
        controller: getController(content),
        customComponents: getCustomComponents(content),
        labels: getLabels(content),
    }
}

function getCustomComponents(content) {
    ccs = content.match(regExCC);
    return (ccs ? ccs : []).map(c => c.replace('<c:', ''));
}

function getLabels(content) {
    lbls = content.match(regExLbl);
    return (lbls ? lbls : []).map(l => l.replace('$Label.', ''));
}

function getController(content) {
    const controller = content.match(regExCont);
    return (controller ? controller[1] : "");
}


module.exports = {
    parseVF,
}