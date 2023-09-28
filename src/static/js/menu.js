const { ipcRenderer } = require('electron');
const querystring = require('querystring');
const products = require('./products.js');
const cart = require('./cart.js');
const path = require('path');
const fs = require('fs');
let url = "products";

const query = querystring.parse(global.location.search)
const modules = JSON.parse(query['modules']);
const uuid = JSON.parse(query['?uuid']);

renderHTML = page => {
  page = path.join(__dirname, page);
  const file = fs.readFileSync(page);
  document.getElementById('content').innerHTML = file;
}

renderHomePage = () => {
  renderHTML(`../../views/products/products.html`, { query: { "uuid": JSON.stringify(uuid) } });
  products.GetProducts(uuid);
  cart.ClearCart();
}

// Check balance each time we switch pages
getUserInfo = () => {
  ipcRenderer.send('request', {
    name: 'getUserInfo',
    type: 'GET',
    url: `api/card?uuid=${uuid}`,
    body: null
  });
}

document.querySelectorAll('.link').forEach((element) => {
  if (modules.indexOf(element.id) != -1) {
    element.classList.remove("hidden")
  }
  
  element.addEventListener('click', function (e) {
    url = element.id;

    getUserInfo();

    switch (url) {
      case "funds":
        renderHTML(`../../views/funds/funds.html`, {query: {"uuid": JSON.stringify(uuid)}});
        break;
      case "activities":
        renderHTML(`../../views/activities/activities.html`, {query: {"uuid": JSON.stringify(uuid)}});
        break;
      default:
        renderHomePage();
        break;
    }
  });
});

// Render user information
ipcRenderer.on('getUserInfo', (event, arg) => {
  if (arg.err !== null) {
    console.error(arg.err);
  } else {
    let data = JSON.parse(arg.data)
    document.getElementById('balance').innerHTML = `€${parseFloat(data.balance).toFixed(2)}`
    document.getElementById('user').innerHTML = data.name
  }
});


getUserInfo();
renderHomePage();
