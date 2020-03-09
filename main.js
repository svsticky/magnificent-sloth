const { app, BrowserWindow, globalShortcut} = require('electron');
const { NFC } = require('nfc-pcsc');



function initialize () {
	win = createWindow();
	const nfc = new NFC();
	nfc.on('reader', reader => {
		reader.on('card', card => {
			//if (Registered) 	then dashboard
			//					else registration
			win.loadFile('src/views/base/base.html')// load the dashboard
			console.log(card.uid);
		});
		//TODO: Clear basket and any occurring actions for 'error', 'end' and 'error'
		reader.on('error', err => {
			console.error('reader error', err);
			win.loadFile('src/views/idle/idle.html')
			// clear any occuring activities 
		});
		reader.on('end', () => {
			win.loadFile('src/views/idle/idle.html')
			// clear any ocurring activities and go back to mainpage
			console.log(reader.name + ' reader disconnected.');
		});
	});
	nfc.on('error', err => {
		win.loadFile('src/views/idle/idle.html')
		console.error(err);
	});
}

function createWindow () {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  });


  // For development purposes
  globalShortcut.register('Ctrl+1', () => {
	  win.loadFile('src/views/idle/idle.html')
  })
  globalShortcut.register('Ctrl+2', () => {
	  win.loadFile('src/views/base/base.html')
  })
  globalShortcut.register('Ctrl+3', () => {
	win.loadFile('src/views/register/register.html')
  })
  win.removeMenu();
  win.loadFile('src/views/idle/idle.html');
  win.webContents.openDevTools()
  return win;
}

app.whenReady().then(initialize);
