const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const { AddToCart } = require('./cart.js');
const querystring = require('querystring');
const { env } = require('process');

module.exports.GetProducts = () => {
  // Define the API request we have to do to get all the items
  // from Koala.
  ipcRenderer.send('request', {
    name: 'getProducts',
    type: 'GET',
    url: 'products',
    body: null
  });

  // ipcRenderer.send('request', {
  //   name: 'recent',
  //   type: 'GET',
  //   url: `api/checkout/recent?uuid=${uuid}`,
  // })
}

// When we receive the data from Koala, render these
// through the renderProduct function.
ipcRenderer.on('getProducts', (event, arg) => {
  if (arg.err !== null) {
    console.error(arg.err);
    document.getElementById('productList').innerHTML = "Something went wrong while requesting data from Koala. Please try again later."
  } else {
    let categories = JSON.parse(arg.data);
    for (let i = 0; i < categories.length; i++) {
      console.log(categories[i]);
      let products = categories[i].products.sort((a, b) => (a.name > b.name) ? 1 : -1)
      for (let j = 0; j < products.length; j++) {
        renderProduct(products[j], categories[i]);
      }
    }
    let products = JSON.parse(arg.data);
    products = products.sort((a, b) => (a.name > b.name) ? 1 : -1)

    // for (let i = 0; i < products.length; i++)
    //   renderProduct(products[i]);

    let date = new Date();
    if (date.getHours() < 17) {
      document.getElementById("alcoholText").style.display = "none";
      document.getElementById("liquor").style.display = "none";
    }
  }
});

// ipcRenderer.on('recent', (event, arg) => {
//   if (arg.err !== null) {
//     console.error(arg.err);
//     document.getElementById('recentList').innerHTML = "Something went wrong while requesting data from Koala. Please try again later."
//   } else {
//     let products = JSON.parse(arg.data);
//     products = products.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
//     if (products.length == 0) document.getElementById('recent').remove()
    
//     for (let i = 0; i < products.length && i < 5; i++) {
//       renderProduct(products[i], true)
//     }
//   }
// });

// Renders the block for each product.
function renderProduct(prod, category, recent = false) {
  let page = path.join(__dirname, '../../views/products/product.html');
  let product = fs.readFileSync(page);
  let html = document.createElement('article');
  console.log(prod);
  html.className = 'column';
  html.innerHTML = product;
  html.getElementsByClassName('name')[0].innerHTML = prod.name
  html.getElementsByClassName('category')[0].innerHTML = category.name
  html.getElementsByClassName('price')[0].innerHTML = `€${Number(prod.price).toFixed(2)}`
  if (prod.image_url) {
    html.getElementsByClassName('productImage')[0].src = prod.image_url
  }
  html.addEventListener("click", () => { AddToCart(prod) });

  // document.getElementById(recent ? 'recentList' : prod.category).append(html);
  console.log(category.name);
  document.getElementById(category.name.toLowerCase()).append(html);
}

let query = querystring.parse(global.location.search)
let uuid = JSON.parse(query['?uuid']);
