const path = require('path');
const { contextBridge } = require('electron');

const textBasePath = path.join(__dirname, '../')

const testImageCount = 10
const testImages = [...Array(testImageCount).keys()].map((img, i) => {
    return {
        id: i,
        path: path.join(__dirname, 'logo-512.png'),
        keep: false,
    }
})
const testProject = {
    name: 'Test Project',
    basePath: textBasePath,
    exportPath: path.join(__dirname, 'keepers'),
    projectFile: path.join(__dirname, 'Test Project.keep'),
    images: testImages,
};

contextBridge.exposeInMainWorld('testProject', testProject);