const path = require('path');
const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const api = require('../src/lib/api');
const { registerIpcHandlers } = require('../src/lib/helpers');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000/'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if(isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }

    api.setWindow(win);
}

app.whenReady()
.then(() => {
    if(!isDev) return;
    return installExtension(REACT_DEVELOPER_TOOLS)
})
.then(() => {
    //register atom protocol
    protocol.registerFileProtocol('atom', (req, cb) => {
        const url = req.url;
        cb({ path: url.substring(7) });
    });

    registerIpcHandlers(ipcMain, api);

    //create window
    createWindow();
});


app.on('window-all-closed', () => {
    // don't exit process on mac even if all windows closed
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // if no active windows, create new one
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})