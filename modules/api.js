const { net } = require('electron');
const querystring = require('querystring');

module.exports.Request = async (type, url, reqBody, callback) => {
  const request = net.request({
    method: type,
    protocol: process.env.PROTOCOL,
    hostname: process.env.HOST,
    port: process.env.PORT,
    path: `${url}?token=${process.env.TOKEN}`
  });

  request.on('response', (response) => {
    // Request is only successful if status code 2XX
    if (/^2/.test(response.statusCode)) {
      response.on('data', (data) => {
        let bufferData = Buffer.from(data);
        let res = bufferData.toString();
        console.log(res);
        callback(null, res);
      });
    } else {
      callback({
        statusCode: response.statusCode,
        error: response.statusMessage
      }, null);
    }
});
request.on('error', (error) =>{
  console.log(error)
})


request.write(querystring.encode(reqBody));

request.end();
}