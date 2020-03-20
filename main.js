const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut
} = require('electron');
const {
  Request
} = require('./modules/api');
require('dotenv').config();

function initialize() {
  createWindow()
}

function createWindow() {

  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.removeMenu();
  win.webContents.openDevTools();
  win.loadFile('src/views/base/base.html');

  // For development purposes
  globalShortcut.register('Ctrl+1', () => {
    win.loadFile('src/views/base/base.html')
  })

  globalShortcut.register('Ctrl+2', () => {
    win.loadFile('src/views/base/base.html')
  })

  globalShortcut.register('Ctrl+3', () => {
    win.loadFile('src/views/register/register.html')
  })

}




ipcMain.on('request', (event, arg) => {
  Request(arg.type, arg.url, arg.body, (err, data) => {
    event.sender.send(arg.name, {
      err: err,
      data: data
    });
  });
});

app.on('ready', initialize);