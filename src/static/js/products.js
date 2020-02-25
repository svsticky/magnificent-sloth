const { remote } = require('electron');
const path = require('path');
const fs = require('fs');
const { net } = remote;
const settings = require('../../../settings.json');
const { AddToCart } = require('./cart.js');

// Define the API request we have to do to get all the items
// from Koala.
const request = net.request({
  method: 'GET',
  hostname: settings.host,
  port: settings.port,
  path: `api/checkout/products?token=${settings.token}`
});

// When we receive the data from Koala, render these
// through the renderProduct function.
request.on('response', (response) => {
  response.on('data', data => {
    let bufferData = Buffer.from(data);
    products = JSON.parse(bufferData.toString());
    
    for(let i = 0; i < products.length; i++)
      renderProduct(products[i]);
  });
});

request.end();

// Renders the block for each product.
function renderProduct(prod) {
  let page = path.join(__dirname, '../../views/products/product.html');
  let product = fs.readFileSync(page);
  let html = document.createElement('article');

  html.className = 'column';
  html.innerHTML = product;
  html.getElementsByClassName('name')[0].innerHTML = prod.name
  html.getElementsByClassName('category')[0].innerHTML = prod.category.charAt(0).toUpperCase() + prod.category.slice(1)
  html.getElementsByClassName('price')[0].innerHTML = `€${Number(prod.price).toFixed(2)}`
  if(prod.image)
    html.getElementsByClassName('productImage')[0].src = prod.image
  html.addEventListener("touchstart", () => AddToCart(prod));
  html.addEventListener("click", () => AddToCart(prod));

  document.getElementById('productList').append(html);
}