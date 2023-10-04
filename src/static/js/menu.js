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

renderHTML = (page, page_type) => {
  page = path.join(__dirname, page);
  const file = fs.readFileSync(page);
  document.getElementById(`${page_type}-page`).innerHTML = file;
}

renderPages = () => {
  renderHTML(`../../views/products/products.html`, "products");
  renderHTML(`../../views/funds/funds.html`, "funds");
  renderHTML(`../../views/activities/activities.html`, "activities");
  cart.ClearCart();
  products.GetProducts(uuid);
  document.getElementById("products-page").classList.remove("hidden");
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
        // Show funds, hide others
        document.getElementById("products-page").classList.add("hidden");
        document.getElementById("activities-page").classList.add("hidden");
        document.getElementById("funds-page").classList.remove("hidden");
        break;
      case "activities":
        // Show activities, hide others
        document.getElementById("products-page").classList.add("hidden");
        document.getElementById("activities-page").classList.remove("hidden");
        document.getElementById("funds-page").classList.add("hidden");
        break;
      default:
        // Show products, hide others
        cart.ClearCart();
        products.GetProducts(uuid);
        document.getElementById("products-page").classList.remove("hidden");
        document.getElementById("activities-page").classList.add("hidden");
        document.getElementById("funds-page").classList.add("hidden");
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
    if (data) {
      document.getElementById('balance').innerHTML = `€${parseFloat(data.balance).toFixed(2)}`
      document.getElementById('user').innerHTML = data.name
    }
  }
});

getUserInfo();
renderPages();
