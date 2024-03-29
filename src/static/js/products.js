const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');
const { AddToCart } = require('./cart.js');
const querystring = require('querystring');

module.exports.GetProducts = (uuid) => {
  // Define the API request we have to do to get all the items
  // from Koala.
  ipcRenderer.send('request', {
    name: 'getProducts',
    type: 'GET',
    url: `api/products?uuid=${uuid}`,
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
  document.getElementById("categoryList").firstElementChild.innerHTML = "";
  document.getElementById("productList").innerHTML = "";

  if (arg.err !== null) {
    console.error(arg.err);
    document.getElementById('productList').innerHTML = "Something went wrong while requesting data from Koala. Please try again later."
  } else {
    let categories = JSON.parse(arg.data);
    if (categories && categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        // Create category HTML
        let category = categories[i];
        let parser = new DOMParser();
        // A body gets inserted which does something weird with the buttons
        document.getElementById("categoryList").firstElementChild.append(parser.parseFromString(
          `<a class="ui basic button category_button" href="#${category.name.toLowerCase()}_header">${category.name}</a>`
        , 'text/html').body.firstChild);
        document.getElementById("productList").append(parser.parseFromString(
          `
          <article>
            <a class="category_headers" id="${category.name.toLowerCase()}_header"></a>
            <h1 class="ui horizontal divider header">
              ${category.name}
            </h1>
            <section id="${category.name.toLowerCase()}" class="ui five column grid products"></section>
          </article>
          `
        , 'text/html').body.firstChild);

        let products = category.products.sort((a, b) => (a.name > b.name) ? 1 : -1)
        for (let j = 0; j < products.length; j++) {
          renderProduct(products[j], category);
        }
      }
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
  document.getElementById(category.name.toLowerCase()).append(html);
}
