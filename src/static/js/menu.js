const fs = require('fs');
const path = require('path');
const products = require('./products.js');
const cart = require('./cart.js');
let url = "products";

function renderHTML(page) {
  page = path.join(__dirname, page);
  const file = fs.readFileSync(page);
  document.getElementById('content').innerHTML = file;
}

function renderHomePage() {
  renderHTML(`../../views/products/products.html`);
  products.GetProducts();
  cart.ClearCart();
}

document.querySelectorAll('.link').forEach((element) => {
  element.addEventListener('click', function(e) {
    url = element.id
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

renderHomePage();