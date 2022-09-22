const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { slugify } = require('./helpers');

const IMAGE_FORMATS = ['.png', '.gif', '.jpg', '.jpeg', '.CR2', '.CR3'];

//PRIVATE functions
function readProjectFile(path) {
    return JSON.parse(fs.readFileSync(path));
}

function writeProjectFile(project) {
    console.log({msg: 'writing', project});
    fs.writeFileSync(project.projectFile, JSON.stringify(project));
}

function isImageFile(name) {
    return IMAGE_FORMATS.includes(path.extname(name));
}

function clearImages(folder) {
    fs.readdirSync(folder, { withFileTypes: true }).forEach(entry => {
        if(isImageFile(entry.name)) {
            fs.unlinkSync(path.join(folder, entry.name));
        }
    })
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

function createProject(event, {name, basePath, exportPath}) {
    let project = {
        name,
        basePath,
        exportPath,
        images: [],
        projectFile: path.join(basePath, `${slugify(name)}.kprj`),
        nextId: 0,
    };

    // Add a new image to the project, updating the nextId property
    function addImageToProject(path, relativePath) {
        const image = {
            id: project.nextId,
            keep: false,
            path,
            relativePath
        };

        project.images = [
            ...project.images,
            image,
        ];
        project.nextId += 1;
    }


    try {
        // if project file already exists, open it instead
        if(fs.existsSync(project.projectFile)) {
            return openProject(project.projectFile);
        }

        // loop through files in folder to find images
        const entries = fs.readdirSync(basePath, {withFileTypes: true})
        entries.forEach(entry => {
            if(entry.isFile()){
                const name = entry.name;
                if(isImageFile(name)) {
                    // add to project
                    addImageToProject(path.join(basePath, name), name);
                }
            }
        });

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