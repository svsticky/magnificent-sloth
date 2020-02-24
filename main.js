const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const {
  Request
} = require('./modules/api');
const {
  NFC
} = require('nfc-pcsc');
require('dotenv').config();




function initialize() {
  const nfc = new NFC();
  nfc.on('reader', reader => {

    console.log(reader.name + ' reader attached, waiting for cards ...');

    reader.on('card', card => {
      console.log(card.uid);
    });

    reader.on('error', err => {
      console.error('reader error', err);
    });

    reader.on('end', () => {
      console.log(reader.name + ' reader disconnected.');
    });
  });

  nfc.on('error', err => {
    console.error(err);
  });

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
  // win.removeMenu();
  win.webContents.openDevTools();
  win.loadFile('src/views/base/base.html');
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