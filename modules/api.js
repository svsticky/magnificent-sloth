const { net } = require('electron');
const querystring = require('querystring');

module.exports.Request = async (type, url, reqBody, callback) => {
  const request = net.request({
    method: type,
    protocol: process.env.PROTOCOL,
    hostname: process.env.HOST,
    port: process.env.PORT,
    path: url.includes('?') ? `${url}&token=${process.env.TOKEN}` : `${url}?token=${process.env.TOKEN}`
  });

  request.on('response', (response) => {
    response.on('data', (data) => {
      let bufferData = Buffer.from(data);
      let res = bufferData.toString();
      callback(null, res);
    });
});
request.on('error', (error) =>{
  console.log(error)
})


request.write(querystring.encode(reqBody));

request.end();
}