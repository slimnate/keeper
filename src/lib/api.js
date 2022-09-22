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
    return fs.writeFileSync(project.projectFile, JSON.stringify(project))
}


// PUBLIC functions

function openFolder(){
    const filePaths = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    })
    return filePaths
}

function createProject(event, { name, basePath, exportPath}) {
    let project = {
        name,
        basePath,
        exportPath,
        images: [],
        projectFile: path.join(basePath, `${slugify(name)}.kprj`),
        nextId: 0,
    };

    // Add a new image to the project, updating the nextId property
    function addImageToProject(path, relPath) {
        const image = {
            id: project.nextId,
            keep: false,
            path,
            relPath
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
                const extension = path.extname(name);

                if(IMAGE_FORMATS.includes(extension)) {
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

function openProject(filePath) {
    let project;
    try {
        project = readProjectFile(filePath);
    } catch (e) {
        return { err: e };
    }
    return { project }
}

const api = {
    fs: {
        openFolder,
        createProject,
        openProject,
    }
}

module.exports = api;