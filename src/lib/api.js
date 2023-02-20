const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { slugify } = require('./helpers');
const extractd = require('extractd');
const IpcApi = require('slim-electron-ipc-api');
const sharp = require('sharp');
const { createProgressNotifier } = require('./progress');

const STANDARD_FORMATS = ['.png', '.gif', '.jpg', '.jpeg', ];
const RAW_FORMATS = ['.cr2', '.cr3', '.rw2', '.arw', '.nef', '.dng'];
const IMAGE_FORMATS = [
    ...STANDARD_FORMATS,
    ...RAW_FORMATS,
]

let window = null;

function setWindow(win) {
    window = win;
}

function sendProgressMessage (data) {
    window.webContents.send('progress', data);
}

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

/**
 * Gets the width and height of an image taking into account it's exif orientation
 * 
 * https://sharp.pixelplumbing.com/api-input#metadata
 * @typedef SharpMeta
 * @property {number} width
 * @property {number} height
 * @property {0|1|2|3|4|5|6|7|8} orientation
 * 
 * @param {SharpMeta} meta 
 * @returns {{width: number, height: number}}
 */
function getNormalSize({ width, height, orientation }) {
  return (orientation || 0) >= 5
    ? { width: height, height: width }
    : { width, height };
}

async function generatePreview(destDir, image) {
    let inPath = image.path;
    const inFileName = path.basename(image.relativePath, path.extname(inPath))
    const outPath = path.join(destDir, `${inFileName}_preview.jpg`);
    const isRaw = isRawFormat(inPath);

    // perform raw conversion to jpg using extractd library
    if(isRaw) {
        // update inPath to point to the extracted jpg file
        inPath = await extractd.generate(image.path, { datauri: false, compact: true, persist: true });
    }

    // perform resizing for preview with sharp library
    const sharpImage = sharp(inPath);
    const { width, height } = getNormalSize(await sharpImage.metadata());
    const isLandscape = width > height;

    // shrink image by a factor of 4, with a min width of 1024 for landscape and 768 for portrait
    const requestedWidth = Math.floor(isLandscape ? Math.max(1024, width / 4) : Math.max(768, height / 4));
    
    await sharpImage
        .rotate()
        .resize({ width: requestedWidth })
        .toFile(outPath);

    return outPath;
}

async function generateThumbnail(image) {
    const inPath = image.previewPath;
    const outPath = inPath.replace('_preview', '_thumb');

    await sharp(inPath)
        .rotate()
        .resize({ width: 80 })
        .toFile(outPath);

    return outPath;
}

async function performConversions(image, tempDir) {
    // generate preview and thumbnail images
    image.previewPath = await generatePreview(tempDir, image);
    image.thumbnailPath = await generateThumbnail(image);

    return image;
}

function getProjectTempDir(project){
    // folder to store converted files
    const tempDir = path.join(os.tmpdir(), 'keeper', slugify(project.name));

    // make temp dir if it does not exist
    if(!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, {recursive: true});
    }

    return tempDir;
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
            thumbnailPath: null,
            path,
            relativePath
        };

        image = await performConversions(image, getProjectTempDir(project));
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

        // filter out all non-image files
        const entries = fs.readdirSync(basePath, {withFileTypes: true}).filter(entry => {
            return entry.isFile() && isImageFile(entry.name);
        });

        // set up progress notifier
        const progress = createProgressNotifier(entries.length, sendProgressMessage);
        progress.start();
        
        // loop through files in folder to find images
        for(const entry of entries) {
            progress.notify('Generating image preview...');
            // add to project
            await addImageToProject(path.join(basePath, entry.name), entry.name);
            progress.next();
        };

        writeProjectFile(project);

    } catch (e) {
        console.log({e});
        return { err: e };
    }

    return { project };
}

async function openProject(event, filePath) {
    try {
        const project = readProjectFile(filePath);

        //check images for missing previews
        const progress = createProgressNotifier(project.images.length, sendProgressMessage);
        progress.start();

        for(const i in project.images) {
            progress.notify('Validating image...');

            const image = project.images[i];

            // check if preview or thumbnail no longer exist, and regenerate
            if(!fs.existsSync(image.previewPath) || ! fs.existsSync(image.thumbnailPath)) {
                // notify and perform conversions
                progress.notify('Regenerating image preview...');
                project.images[i] = await performConversions(image, getProjectTempDir(project));
            }

            progress.next();
        }

        //re-save project file to update image paths
        writeProjectFile(project);

        return { project };
    } catch (e) {
        console.log({e});
        return { err: e };
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
        console.log({e});
        return {err: e};
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

module.exports = {
    setWindow,
    ipc: new IpcApi(api)
};