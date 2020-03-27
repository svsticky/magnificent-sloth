const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const { AddToCart } = require('./cart.js');

let uuid = "ec3ed712";

module.exports.GetProducts = () => {
  // Define the API request we have to do to get all the items
  // from Koala.

  ipcRenderer.send('request', {
    name: 'getProducts',
    type: 'GET',
    url: 'api/checkout/products',
    body: null
  });

  ipcRenderer.send('request',{
    name: 'recent',
    type: 'GET',
    url: `api/checkout/recent?uuid=${uuid}`,
  })
}

// When we receive the data from Koala, render these
// through the renderProduct function.
ipcRenderer.on('getProducts', (event, arg) => {
  if (arg.err !== null) {
    console.error(arg.err);
    document.getElementById('productList').innerHTML = "Something went wrong while requesting data from Koala. Please try again later."
  } else {
    let products = JSON.parse(arg.data);

    for(let i = 0; i < products.length; i++)
      renderProduct(products[i]);
  }
});
ipcRenderer.on('recent', (event, arg) => {
  if (arg.err !== null){
    console.error(arg.err);
    document.getElementById('recentList').innerHTML = "Something went wrong while requesting data from Koala. Please try again later."
  } else{
    let products = JSON.parse(arg.data);
    if (products.length == 0) document.getElementById('recent').remove()
    for(let i = 0; i< products.length; i++){
      renderProduct(products[i],true)
    }
  }
})

// Renders the block for each product.
function renderProduct(prod, recent = false) {
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
  html.addEventListener("touchstart", () => {AddToCart(prod)});
  html.addEventListener("click", () => {AddToCart(prod)});

  document.getElementById(recent ? 'recentList' : prod.category).append(html);
}