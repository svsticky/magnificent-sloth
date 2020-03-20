const { ipcRenderer } = require('electron');
const products = require('./products.js');
const cart = require('./cart.js');
const path = require('path');
const fs = require('fs');
let url = "products";

renderHTML = page => {
  page = path.join(__dirname, page);
  const file = fs.readFileSync(page);
  document.getElementById('content').innerHTML = file;
}

renderHomePage = () => {
  renderHTML(`../../views/products/products.html`);
  products.GetProducts();
  cart.ClearCart();
}

// Check balance each time we switch pages
getUserInfo = () => {
  let uuid = 'ec3ed712';
  ipcRenderer.send('request', {
    name: 'getUserInfo',
    type: 'GET',
    url: `api/checkout/card?uuid=${uuid}`,
    body: null
  });
}

document.querySelectorAll('.link').forEach((element) => {
  element.addEventListener('click', function(e) {
    url = element.id;

    getUserInfo();

    switch(url) {
      case "funds":
        renderHTML(`../../views/funds/funds.html`);
        break;
      case "activities":
        renderHTML(`../../views/activities/activities.html`);
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
    document.getElementById('user').innerHTML = data.first_name
  }
});

getUserInfo();
renderHomePage();