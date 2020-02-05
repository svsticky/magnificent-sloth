const { app, BrowserWindow } = require('electron');
const ejs = require('ejs');

function createWindow () {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadFile('src/views/base/base.html');
  win.webContents.openDevTools()
}

app.on('ready', createWindow);