const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut
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
    ipcMain.on('register-card', (event, arg) => {
      //	F834555
      var postData = querystring.encode({
        token: "581c2787e3a91be709fcb3389ab2460a1ce3bcb3e5232b1d85807279c8291411dd18953277609284cb5abe440609a4c61f54234ff402c5789d1900b41e64a9ed",
        student: arg,
        uuid: "testsss"
      })
      const requestApi = net.request({
        method: 'POST',
        protocol: 'http:',
        hostname: 'koala.rails.local',
        port: 3000,
        path: '/api/checkout/card',

      })
      requestApi.on('response', (response) => {
        console.log(`STATUS: ${response.statusCode}`)
        console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        event.reply('register-card-reply', response)
      })

      requestApi.write(postData);
      requestApi.end();

    })
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