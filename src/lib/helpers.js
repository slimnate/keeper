// Slugify a string
// credit: https://lucidar.me/en/web-dev/how-to-slugify-a-string-in-javascript/
function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

function getImagePath(image) {
    return `atom://${image.previewPath ? image.previewPath : image.path}`
}

function registerIpcHandlers(ipcMain, api) {
    //register ipc event handlers for all methods from api.js
    Object.keys(api).forEach((prefix) => {
        // ignore base level functions (like configure)
        if (typeof api[prefix] === 'function') {
            return;
        }
        Object.keys(api[prefix]).forEach((funcName) => {
            console.log(`registering handler for ${prefix}:${funcName}`)
            ipcMain.handle(`${prefix}:${funcName}`, api[prefix][funcName]);
        })
    });
}

function getIpcInvoker(ipcRenderer, api) {
    let invoker = {};
    Object.keys(api)
    .filter(prefix => {
        // ignore base level functions (like configure)
        return typeof api[prefix] !== 'function';
    })
    .forEach(prefix => {
        let subModule = {};
        Object.keys(api[prefix]).forEach(funcName => {
            console.log(`registering invoker for ${prefix}:${funcName}`)
            subModule[funcName] = (props) => ipcRenderer.invoke(`${prefix}:${funcName}`, props);
        })
        invoker[prefix] = subModule;
    })
    return invoker;
}

const rollingIncrement = (current, start, end, decrement = false) => {
    const change = decrement ? -1 : 1;

    // rotate from start to end
    if(decrement && current === start) return end;

    // rotate from end to start
    if(!decrement && current === end) return start;

    return current + change;
}

const helpers = {
    slugify,
    getImagePath,
    registerIpcHandlers,
    getIpcInvoker,
    rollingIncrement,
}

module.exports = helpers;