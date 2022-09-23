const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { slugify } = require('./helpers');
const extractd = require('extractd');

const STANDARD_FORMATS = ['.png', '.gif', '.jpg', '.jpeg', ];
const RAW_FORMATS = ['.cr2', '.cr3', ];
const IMAGE_FORMATS = [
    ...STANDARD_FORMATS,
    ...RAW_FORMATS,
]

//PRIVATE functions
function readProjectFile(path) {
    return JSON.parse(fs.readFileSync(path));
}

function writeProjectFile(project) {
    console.log({msg: 'writing', project});
    fs.writeFileSync(project.projectFile, JSON.stringify(project));
}

function isImageFile(name) {
    return IMAGE_FORMATS.includes(path.extname(name).toLowerCase());
}

function clearImages(folder) {
    fs.readdirSync(folder, { withFileTypes: true }).forEach(entry => {
        if(isImageFile(entry.name)) {
            fs.unlinkSync(path.join(folder, entry.name));
        }
    })
}

function isRawFormat(name) {
    return RAW_FORMATS.includes(path.extname(name).toLowerCase());
}

async function performConversions(image) {
    if(isRawFormat(image.relativePath)) {
        const previewPath = await extractd.generate(image.path, { datauri: true, compact: true, persist: true });
        return {
            ...image,
            previewPath
        }
    } else {
        return image;
    }
}


// PUBLIC functions

function openFolder(){
    const filePaths = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    });
    return filePaths;
}

function openFile() {
    const filePaths = dialog.showOpenDialogSync({
        filters: [{ name: 'Keeper Project Files', extensions:['kprj']}],
        properties: ['openFile']
    });
    return filePaths;
}

async function createProject(event, {name, basePath, exportPath}) {
    let project = {
        name,
        basePath,
        exportPath,
        images: [],
        projectFile: path.join(basePath, `${slugify(name)}.kprj`),
        nextId: 0,
    };

    // Add a new image to the project, updating the nextId property
    async function addImageToProject(path, relativePath) {
        let image = {
            id: project.nextId,
            keep: false,
            previewPath: null,
            path,
            relativePath
        };

        image = await performConversions(image);
        project.images = [
            ...project.images,
            image,
        ];
        project.nextId += 1;
        console.log(image);
        return image;
    }

    try {
        // if project file already exists, open it instead
        if(fs.existsSync(project.projectFile)) {
            return openProject(null, project.projectFile);
        }

        // loop through files in folder to find images
        const entries = fs.readdirSync(basePath, {withFileTypes: true})
        for(const entry of entries) {
            if(entry.isFile()){
                const name = entry.name;
                if(isImageFile(name)) {
                    // add to project
                    await addImageToProject(path.join(basePath, name), name);
                }
            }
        };

        writeProjectFile(project);

    } catch (e) {
        return {err: e.message};
    }

    return { project };
}

function openProject(event, filePath) {
    try {
        return { project: readProjectFile(filePath) }
    } catch (e) {
        return { err: e.message };
    }
}

function saveProject(event, project) {
    try {
        writeProjectFile(project);
        return { project: readProjectFile(project.projectFile) }
    } catch (e) {
        return {err: e.message};
    }
}

function exportProject(event, project) {
    try {
        const exportPath = path.join(project.basePath, project.exportPath);
        let imageCount = 0;

        // check if export folder exists
        if(fs.existsSync(exportPath)) {
            // check if export folder is directory
            if(fs.statSync(exportPath).isDirectory()) {
                clearImages(exportPath);
            } else {
                // if export path is file we will abort with en error, to avoid messing up existing files
                throw new Error('exportPath cannot point to an existing file');
            }
        } else {
            // if export folder does not exist, create it
            fs.mkdirSync(exportPath);
        }
        
        // copy kept images to export folder
        project.images.forEach(image => {
            if(image.keep) {
                const sourcePath = image.path;
                const destinationPath = path.join(exportPath, image.relativePath);

                fs.writeFileSync(destinationPath, fs.readFileSync(sourcePath));
                imageCount++;
            }
        })

        return { result: { imageCount } }
    } catch (e) {
        console.log({e})
        return {err: e.message}
    }
}

const api = {
    fs: {
        openFolder,
        openFile,
        createProject,
        openProject,
        saveProject,
        exportProject,
    }
}

module.exports = api;