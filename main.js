const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut
} = require('electron');
const {
  Request
} = require('./modules/api');
require('dotenv').config('.env');
const { NFC } = require('nfc-pcsc');

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

  win.removeMenu();
  win.webContents.openDevTools();
  win.loadFile('src/views/idle/idle.html');

  // Switch back to idle if register finished
  ipcMain.on('register-finished', (event, arg) => {
    win.loadFile('src/views/idle/idle.html')
  });

  const nfc = new NFC();
  nfc.on('reader', reader => {
    reader.autoProcessing = false;
    
    reader.on('card', async card => {
      const apdu = 'FFCA000000';
      const data = Buffer.from(apdu, "hex");
      let uuid = null;
      try {
        const uid = await reader.transmit(data, 12);
        uuid = uid.toString("hex").substring(0, 8);
      }
      catch (err) {
        console.log(err);
        return;
      }

      await Request('GET', `api/checkout/card?uuid=${uuid}`, null, (err, data, statuscode) => {
        
        if (statuscode == 404){
          win.loadFile(`src/views/register/register.html`, {query: {"uuid": JSON.stringify(uuid)}}) // load the dashboard
        }
        else if (statuscode == 401){
          // not activated pop up
        }
        else{
          win.loadFile(`src/views/base/base.html`, {query: {"uuid": JSON.stringify(uuid)}}) // load the dashboard
        }
      });
    });
    reader.on('card.off', card => {
      win.loadFile('src/views/idle/idle.html')
    });
    //TODO: Clear basket and any occurring actions for 'error', 'end' and 'error'
    reader.on('error', err => {
      console.error('reader error', err);
      win.loadFile('src/views/idle/idle.html')
      // clear any occuring activities 
    });
    reader.on('end', () => {
      console.log(reader.name + ' reader disconnected.');
      win.loadFile('src/views/idle/idle.html')
      // clear any ocurring activities and go back to mainpage
      
    });
  });
  nfc.on('error', err => {
    console.log('hnnggg')
    console.error(err);
    win.loadFile('src/views/idle/idle.html')

  });

  // For development purposes
  globalShortcut.register('Ctrl+1', () => {
    win.loadFile('src/views/base/base.html')
  });

  globalShortcut.register('Ctrl+2', () => {
    win.loadFile('src/views/idle/idle.html')
  });

  globalShortcut.register('Ctrl+3', () => {
    win.loadFile('src/views/register/register.html')
  });
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

app.on('ready', createWindow)