const settings = require('../../../settings.json');
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
  module.exports.renderCart();
}

// Gets all the items from the cart and shows the product with amount
// in the cart for the user to see. This function also increments the
// total price which will be displayed for the user to see.
module.exports.renderCart = () => {
  document.getElementById('cartList').innerHTML = '';
  for(let i = 0; i < cartList.length; i++) {
    let cartElement = document.createElement('p');
    cartElement.innerHTML = `${cartList[i].amount}x - ${cartList[i].name}`
    document.getElementById('cartList').append(cartElement);
  }
  document.getElementById('totalCost').innerHTML = `€${Number(cost).toFixed(2)}`;
  document.getElementById('purchase').addEventListener('click', () => purchase)
}

// Event for when the user click purchase. Send a request to Koala
// to handle the payment for us.
function purchase() {
  let userInfo = {
    token: settings.token,
    uuid: '800a3bc7', // Test ID
    items: cartList
  }

  const request = net.request({
    method: 'POST',
    hostname: settings.host,
    port: settings.port,
    path: 'api/checkout/transaction'
  });

  request.on('response', (response) => {
    response.on('data', data => {
      let bufferData = Buffer.from(data);
      let res = bufferData.toString();
      console.log(res);
    });
  });
  
  request.end(userInfo);
}