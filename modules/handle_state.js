const { Request } = require('./api');

module.exports.CardOn = async (win, uuid) => {
  await Request('GET', `api/checkout/card?uuid=${uuid}`, null, (err, data, statusCode) => {
    if (statusCode == 200) {
      // Load the dashboard
      win.loadFile(`src/views/base/base.html`, {query: {"uuid": JSON.stringify(uuid)}});
    } else if (statusCode == 404) {
      // Show register page if card not found
      win.loadFile(`src/views/register/register.html`);
    } else if (statusCode == 401) {
      // Blocked card
      win.loadFile(`src/views/idle/idle.html`, {query: {error: "This card has been blocked. Please add a new card."}});
    } else if (statusCode == 403) {
      // Card not yet activitated
      win.loadFile(`src/views/idle/idle.html`, {query: {error: "This card has not been activated yet. Please confirm or contact a board member."}});
    } else {
      // Show message that something went wrong
      win.loadFile(`src/views/idle/idle.html`, {query: {error: "Something went wrong while reading your card. Please try again later."}});
    }
  });
}

module.exports.ClearBasket = async () => {
  // TODO: Clear basket, activities, etc.
}
