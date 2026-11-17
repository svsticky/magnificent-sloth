const { net } = require('electron');

module.exports.Request = async (type, url, reqBody, callback) => {
  const request = net.request({
    method: type,
    protocol: process.env.PROTOCOL,
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
        return;
      });
    } else {
      // Pass the error body along, so callers can tell errors with the same status apart.
      let body = '';
      response.on('data', (data) => body += Buffer.from(data).toString());
      response.on('end', () => callback(response.statusMessage, body, response.statusCode));
      return;
    }

    callback(null, null, response.statusCode);
  });

  request.on('error', (error) =>{
    callback(error,null,null)
  })

  if(reqBody !== null)
    request.write(JSON.stringify(reqBody));

  request.end();
}
