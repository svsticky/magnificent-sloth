const { net } = require('electron');
const querystring = require('querystring');

module.exports.Request = async (type, url, reqBody, callback) => {
  const request = net.request({
    method: type,
    protocol: process.env.PROTOCOl,
    hostname: process.env.HOST,
    port: process.env.PORT,
    path: `${url.includes('?') ? 
          `${url}&token=${process.env.TOKEN}` : 
          `${url}?token=${process.env.TOKEN}`}`,
    headers: {
      Authorization: process.env.TOKEN
    }
  });

  request.on('response', (response) => {
    // Request is only successful if status code 2XX
    if (/^2/.test(response.statusCode)) {
      response.on('data', (data) => {
        let bufferData = Buffer.from(data);
        let res = bufferData.toString();
        callback(null, res, response.statusCode);
      });
    } else {
      callback(response.statusMessage, null, response.statusCode);
    }
  });
  
  request.on('error', (error) =>{
    callback(error,null,null)
  })
  if(reqBody !== null)
    request.write(JSON.stringify(reqBody));

  request.end();
}
