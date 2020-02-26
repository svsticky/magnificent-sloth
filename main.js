const { app, BrowserWindow } = require('electron');
const { NFC } = require('nfc-pcsc');



function initialize () {
	const nfc = new NFC();
	console.log("nfc start")
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
function createWindow () {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.webContents.openDevTools();
  win.loadFile('src/views/home/home.html');
  return
}

app.on('ready', initialize);