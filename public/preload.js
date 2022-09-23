const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const api = require('../src/lib/api');
const { getIpcInvoker } = require('../src/lib/helpers');

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
const apiInvoker = getIpcInvoker(ipcRenderer, api);
console.log({apiInvoker});

contextBridge.exposeInMainWorld('api', apiInvoker);

contextBridge.exposeInMainWorld('progress', {
    onUpdateProgress: callback => ipcRenderer.on('progress', callback)
})