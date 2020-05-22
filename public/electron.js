const {app, shell, BrowserWindow, dialog, ipcMain, session } = require('electron');
const model = require('../src/model.js');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680,   webPreferences: {
    nodeIntegration: true,
    allowRendererProcessReuse: true,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  }});
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.autoHideMenuBar = false;
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
    mainWindow.autoHideMenuBar = true;
  }
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });
}


app.on('browser-window-created', async () => {
})



app.on('ready', createWindow);

app.on('window-all-closed', async () => {
  await session.defaultSession.clearStorageData();
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on('layout-data', async (event, arg) => {
  const success = await model.process(arg.output);
  if (!success) {
    const options  = {
      buttons: ["OK"],
      message: "There was an error processing your data. Please try again."
     }
     await dialog.showMessageBox(mainWindow, options, () => {})
  }
  event.returnValue = "done"
});