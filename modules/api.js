const { net } = require('electron');
const settings = require('../settings.json')

module.exports.Request = async (type, url, body, callback) => {
  const request = net.request({
    method: type,
    hostname: settings.host,
    port: settings.port,
    path: url
  });

  request.on('response', (response) => {
    response.on('data', data => {
      let bufferData = Buffer.from(data);
      let res = bufferData.toString();
      callback(null, res);
    });
  });

  request.on('error', (response) => {
    callback(response, null);
  });

  if(body !== null)
    request.write(body);

  request.end();
}