const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const api = require('../src/lib/api');

const textBasePath = path.join(__dirname, '../')

const testImageCount = 15
const testImages = [...Array(testImageCount).keys()].map((img, i) => {
    const mod = i % 6;
    let relPath = `test${mod}.png`;

    return {
        id: i,
        relativePath: relPath,
        path: path.join(__dirname, relPath),
        keep: false,
    }
})
const testProject = {
    name: 'Test Project',
    basePath: textBasePath,
    exportPath: 'keepers',
    projectFile: path.join(textBasePath, 'Test Project.keep'),
    images: testImages,
};

contextBridge.exposeInMainWorld('testProject', testProject);

// Automatically register all API invokers and expose to main world
const apiInvoker = {};
Object.keys(api).forEach((prefix) => {
    let subModule = {};
    Object.keys(api[prefix]).forEach(funcName => {
        console.log(`registering invoker for ${prefix}:${funcName}`)
        subModule[funcName] = (props) => ipcRenderer.invoke(`${prefix}:${funcName}`, props);
    })
    apiInvoker[prefix] = subModule;
})
contextBridge.exposeInMainWorld('api', apiInvoker);