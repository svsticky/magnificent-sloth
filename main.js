const { app, BrowserWindow, ipcMain } = require('electron');
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
      nodeIntegration: true
    }
  });

  win.removeMenu();
  win.loadFile('src/views/idle/idle.html');

  // Switch back to idle if register finished
  ipcMain.on('register-finished', (event, arg) => {
    win.loadFile('src/views/idle/idle.html');
  });

  // Handle NFC authentication
  if (process.env.ENV ? process.env.ENV.trim() === "dev" : false) {
    win.webContents.openDevTools();
    HandleAuthDev(win);
  } else {
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
