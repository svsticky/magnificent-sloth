const { net } = require('electron');
const querystring = require('querystring');

module.exports.Request = async (type, url, reqBody, callback) => {
  console.log(type)
  const request = net.request({
    method: type,
    protocol: process.env.PROTOCOL,
    hostname: process.env.HOST,
    port: process.env.PORT,
    path: url.includes('?') ? `${url}&token=${process.env.TOKEN}` : `${url}?token=${process.env.TOKEN}`
  });

  request.on('response', (response) => {
    console.log(response.statusCode);
    response.on('data', data => {
      let bufferData = Buffer.from(data);
      let res = bufferData.toString();
      res.statusCode = response.statusCode;
      callback(null, res);
    });
  });

  request.on('error', (response) => {
    callback(response, null);
  });

  request.write(querystring.encode(reqBody));

  request.end();
}