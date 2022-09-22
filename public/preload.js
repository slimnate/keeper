const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');

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
contextBridge.exposeInMainWorld('electronAPI', {
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
})