const { ipcRenderer } = require('electron');
const querystring = require('querystring');
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
  renderHTML(`../../views/products/products.html`, { query: { "uuid": JSON.stringify(uuid) } });
  products.GetProducts();
  cart.ClearCart();
}

// Check balance each time we switch pages
getUserInfo = () => {
  ipcRenderer.send('request', {
    name: 'getUserInfo',
    type: 'GET',
    url: `api/checkout/card?uuid=${uuid}`,
    body: null
  });
}

document.querySelectorAll('.link').forEach((element) => {
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
    document.getElementById('user').innerHTML = data.first_name
  }
});


let query = querystring.parse(global.location.search)
let uuid = JSON.parse(query['?uuid']);

getUserInfo();
renderHomePage();

// Secret Radio Menu
const interval = 1000;
let firstClick = 0;
let clicks = 0;

const logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  const date = new Date();
  const time = date.getTime();  
  clicks++;

  if (clicks == 1) {
    firstClick = time;
  } else if (clicks >= 5) {
    const lastClick = time;
    const diff = lastClick - firstClick;

    if (diff < interval) {
      console.log("OPENING ADMIN RADIO SCREEN BRRRRTTT");
      $('.ui.modal.radio').modal('show'); // Not showing yet.
    } else {
      console.log("Lol wat probeer je");
    }

    clicks = 0;
    firstClick = 0;
  }
});
