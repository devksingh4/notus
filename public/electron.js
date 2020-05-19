const {app, shell, Notification, BrowserWindow, electron, dialog, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

var fs = require('fs');

const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680,   webPreferences: {
    nodeIntegration: true
  }});
  mainWindow.setAutoHideMenuBar(true);
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'))
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

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on('layout-data', (event, arg) => {
  console.log(arg);
  fs.writeFile('data.json', JSON.stringify(arg), () => {console.log("written")});
  event.returnValue = "received";
});