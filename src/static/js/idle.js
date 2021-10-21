const querystring = require('querystring');
const query = querystring.parse(global.location.search);

if (Object.keys(query).length != 0) {
  const message = JSON.parse(query['?error']);
  if (message) {
    $('body').toast({
      class: 'error',
      message: message
    })
  }
  console.log(message);
}
