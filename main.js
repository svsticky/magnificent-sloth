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
  win.loadFile('src/views/base/base.html');
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow);