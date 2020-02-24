const { app, BrowserWindow } = require('electron');

function createWindow () {

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
}

app.whenReady().then(createWindow);