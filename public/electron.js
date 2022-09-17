const path = require('path');

const { app, BrowserWindow, protocol } = require('electron');
const isDev = require('electron-is-dev');

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
}

app.whenReady().then(() => {
    protocol.registerFileProtocol('atom', (req, cb) => {
        const url = req.url;
        console.log(url);
        cb({ path: url.substring(7) });
    });

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