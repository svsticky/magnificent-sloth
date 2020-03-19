const settings = require('../../../settings.json');
const { ipcRenderer } = require('electron');

let cartList = new Array();
let cost = 0;

// Puts the given product in the cart or increments it if
// it's already present.
module.exports.AddToCart = (product) => {
  let alreadyInCart = cartList.filter(prod => prod.id === product.id);
  cost += Number(product.price);
  
  if(alreadyInCart.length !== 0) {
    let index = cartList.indexOf(alreadyInCart[0]);
    cartList[index].amount++;
  } else {
    product.amount = 1;
    cartList.push(product);
  }
  module.exports.RenderCart();
}

// Gets all the items from the cart and shows the product with amount
// in the cart for the user to see. This function also increments the
// total price which will be displayed for the user to see.
module.exports.RenderCart = () => {
  document.getElementById('cartList').innerHTML = '';
  for(let i = 0; i < cartList.length; i++) {
    let cartElement = document.createElement('p');
    cartElement.innerHTML = `${cartList[i].amount}x - ${cartList[i].name}`
    document.getElementById('cartList').append(cartElement);
  }
  document.getElementById('totalCost').innerHTML = `€${Number(cost).toFixed(2)}`;
  document.getElementById('purchase').addEventListener('click', purchase)
}

module.exports.ClearCart = () => {
  cartList = new Array();
  cost = 0;
  module.exports.RenderCart();
}

// Event for when the user click purchase. Send a request to Koala
// to handle the payment for us.

function purchase() {
  let userInfo = {
    token: settings.token,
    uuid: 'ec3ed712', // Test ID
    items: ''
  }

  cartList.forEach(item => { 
    for(let i = 0; i < item.amount; i++)
      userInfo.items += `${item.id},`;
  });

  userInfo.items = `[${userInfo.items.slice(0, -1)}]`

  ipcRenderer.send('request', {
    name: 'purchase',
    type: 'POST',
    url: `api/checkout/transaction?token=${userInfo.token}&uuid=${userInfo.uuid}&items=${userInfo.items}`,
    body: null,
    callback: (data, err) => {
      if(err !== null) {
        console.error(err);
      } else {
        console.log(data);
      }
    }
  });
}

// Handle purchase response
ipcRenderer.on('response', (event, arg) => {
  if (arg.name === 'purchase') {
    if (arg.err !== null) {
      console.error(arg.err);
    } else {
      console.log('Purchase successful');
      module.exports.ClearCart();
    }
  }
});