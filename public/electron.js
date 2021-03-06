const {app, shell, BrowserWindow, dialog, ipcMain, session } = require('electron');
const model = require('../src/model.js');
const path = require('path');
const isDev = require('electron-is-dev');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const fs = require('fs')

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680,   webPreferences: {
    nodeIntegration: true,
    allowRendererProcessReuse: true,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'), 
    minWidth: 800, 
    minHeight: 600
  }});
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.autoHideMenuBar = true;
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
    mainWindow.removeMenu()
  }
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  model.eventEmitter.on('timeTake', (data) => {
    mainWindow.webContents.send('iterTime',data)
  });

  eventEmitter.on('robj-display', (data) => {
    mainWindow.webContents.send('probInfect',data)
  });

  eventEmitter.on('start-loader', () => {
    mainWindow.webContents.send('startloadscreen')
  });
}


app.on('browser-window-created', async () => {
})



app.on('ready', createWindow);

app.on('window-all-closed', async () => {
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
  event.returnValue = "done"
  eventEmitter.emit("start-loader")
  const bud = await JSON.parse(arg.output)
  const robj = await model.process(bud);
  eventEmitter.emit("robj-display", robj)
  if (!robj.success) {
    const options  = {
      buttons: ["OK"],
      message: "There was an error processing your data. Please try again."
     }
     await dialog.showMessageBox(mainWindow, options, () => {})
  }
});
