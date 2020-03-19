const { app, BrowserWindow, ipcMain } = require('electron');
const { Request } = require('./modules/api');
require('dotenv').config();

function createWindow () {

  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // win.removeMenu();
  win.webContents.openDevTools();
  win.loadFile('src/views/base/base.html');
}

app.whenReady().then(createWindow);

ipcMain.on('request', (event, arg) => {
  Request(arg.type, arg.url, arg.body, (err, data) => {
    event.sender.send('response', {name: arg.name, err: err, data: data});
  });
});