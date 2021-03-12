const { Request } = require('./api');

module.exports.CardOn = async (win, uuid) => {
  await Request('GET', `api/checkout/card?uuid=${uuid}`, null, (err, data, statusCode) => {
    if (statusCode == 404){
      win.loadFile(`src/views/register/register.html`, {query: {"uuid": JSON.stringify(uuid)}}) // load the dashboard
    }
    else if (statusCode == 401){
      // TODO: Add a pop up to show that a card has not been activated yet.
    }
    else{
      win.loadFile(`src/views/base/base.html`, {query: {"uuid": JSON.stringify(uuid)}}) // load the dashboard
    }
  });
}

module.exports.ClearBasket = async () => {
  // TODO: Clear basket, activities, etc.
}
