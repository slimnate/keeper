const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const api = require('../src/lib/api');

const testBasePath = path.join(__dirname, '../test')

const testImageCount = 15
const testImages = [...Array(testImageCount).keys()].map((img, i) => {
    const mod = i % 6;
    let relPath = `test${mod}.png`;

    return {
        id: i,
        relativePath: relPath,
        path: path.join(testBasePath, relPath),
        keep: false,
    }
})
const testProject = {
    name: 'Test Project',
    basePath: testBasePath,
    exportPath: 'keepers',
    projectFile: path.join(testBasePath, 'Test Project.kprj'),
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