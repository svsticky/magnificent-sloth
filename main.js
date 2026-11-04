const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { Request } = require('./modules/api');
const { HandleAuthNFC } = require('./modules/nfc');
const { HandleAuthDev } = require('./modules/dev_auth');
require('dotenv').config('.env');

function createWindow() {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('src/views/idle/idle.html');

  // Switch back to idle if register finished
  ipcMain.on('register-finished', (event, arg) => {
    win.loadFile('src/views/idle/idle.html');
  });

  // Handle NFC authentication
  const isDevEnvironment = process.env.SLOTH_ENV ?
    process.env.SLOTH_ENV.trim() === "dev" :
    false;
  
  if (isDevEnvironment) {
    win.webContents.openDevTools();
    const menu = new Menu();
    HandleAuthDev(win, menu);
  } else {
    win.removeMenu(); // TODO
    HandleAuthNFC(win);
  }
}

ipcMain.on('request', (event, arg) => {
  Request(arg.type, arg.url, arg.body, (err, data, statuscode) => {
    event.reply(arg.name, {
      err: err,
      data: data,
      statusCode: statuscode
    });
  });
});

app.on('ready', createWindow);
