# Keeper - Photo Organizer
Keeper is an open source application designed to help photographers organize the images from a photo shoot. It provides the ability to preview the images in a given folder, marking each as "keep" or "discard", and then allows the user to export only the images marked "keep" to a new sub-folder.

## Installation

#### MAC
Currently, there are only release builds for Mac, to install from the a binary, please visit the [release page](https://github.com/slimnate/keeper/releases) on github.

#### Windows
Windows users must currently [build the application from source](#building-from-source)

#### Linux
Linux users must currently [build the application from source](#building-from-source)

#### Building from source
First, clone the repository from github:
```
git clone https://github.com/slimnate/keeper.git
```

Then run the following commands in the source directory:

```
npm install
npm run make
```

This will package the application to the `out` directory, and leave final builds under the `out/make` directory.

## Usage

When you open the application, you will be greeted with the getting started page, which will prompt you to either create a new project, or open an existing one.

### Creating a new project
To create a project, click the **Create new project** button to open the create project dialog. Provide a name for the project, and use the folder button to browse for a folder with the images you want to add to the project. Then provide the name for the sub-folder that the kept images will be exported to.

> **Note:** If you click away from the project dialog your input will be saved even after the dialog is gone, but if you click **Cancel** the the input will be lost.

Once you create the project, the application may perform some pre-processing[<sup>1<sup>](#camera-raw-support) of the images within the folder, create the new project file, and you will be greeted with the [Main Project View](#main-project-view).

### Opening a project
To open a project, you will need to navigate to the project folder and select the project file from within that folder.

### Main Project View
The main view consists of the [Project Panel](#project-panel), and the [Image Viewer](#image-viewer) components. These are the main components for interacting with a project.

#### Project Panel
The project panel will display a list of the images within the project folder, and metadata about the project.

Image List
: The image list shows all the images in the project, and their current status. Click on an image to view it in the [Image Preview](#image-preview) panel. Use the toggle switches on the image list to mark images as keep/discard.

Project Name
: The name of the project. This will not affect the filename of the project file, only the display name within the application

Project Folder
: **READ ONLY** - Shows the base folder path for the current project.

Export Folder
: The current folder where 'kept' images will be exported (_relative to the project folder_). The small text below this field shows the full path to the export folder.

Export Button
: Export all the 'kept' images to the export folder. Shows the number of images that will be exported in parenthesis on the button. _Recommended to save before exporting._

Save Button
: Save changes to the current project (name, export folder, selections). _Recommended to save before exporting._

#### Image Viewer
The image preview is exactly what it sounds, a full size[*<sup>2</sup>](#full-size-images) preview of the selected image, along with two action buttons on the bottom of the screen.

Discard Button
: Remove the currently selected image from list of keepers.

Keep Button
: Add the currently selected image to list of keepers.

> **Note:** Clicking either of the action buttons will apply the selected action, and then automatically advance the selected image to show the next image in the list.

### Keyboard shortcuts

You can use the left and right arrow keys to navigate through the image list, in addition to clicking in the image panel

### More Info

##### Camera raw support
This application supports the processing of special [Camera RAW files](https://fileinfo.com/filetypes/camera_raw). This is supported by checking the file type of each image at project creation and generating temporary JPG copies of the images using the [extractd](https://www.npmjs.com/package/extractd) library. This is the preprocessing of images referred to in the project creation section.

> **Note:** The original RAW files are never modified, and are what will be copied to the export folder upon project export.

##### "Full Size" images
The Image Viewer shows the image in the biggest possible size that will fit on the screen without scrolling. For large images this will not actually be _full size_. **Click-to-zoom support is planned for future versions.**