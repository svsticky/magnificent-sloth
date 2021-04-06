const querystring = require('querystring');

myBrowserWindow.webContents.on('new-window', () => {
  const query = querystring.parse(global.location.search);
  const message = JSON.parse(query['?error']);

  if (message) {
    $('body').toast({
      class: 'error',
      message: message
    })
  }

  console.log(message);
});
