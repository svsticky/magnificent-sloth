const { ipcRenderer } = require('electron');
const querystring = require('querystring');

let cartList = new Array();
let cost = 0;

// Puts the given product in the cart or increments it if
// it's already present.
module.exports.AddToCart = (product) => {
  let alreadyInCart = cartList.findIndex(prod => prod.id == product.id);
  cost += Number(product.price);

  if (alreadyInCart > -1) {
    cartList[alreadyInCart].amount++;
  } else {
    product.amount = 1;
    cartList.push(product);
  }
  module.exports.RenderCart();
}

RemoveFromCart = (index) => {
  cost -= Number(cartList[index].price);

  if (cartList[index].amount > 1) {
    cartList[index].amount--;
  } else {
    cartList.splice(index, 1);
  }
  module.exports.RenderCart();
}

// Gets all the items from the cart and shows the product with amount
// in the cart for the user to see. This function also increments the
// total price which will be displayed for the user to see.
module.exports.RenderCart = () => {
  document.getElementById('cartList').innerHTML = '';
  for (let i = 0; i < cartList.length; i++) {
    let cartElement = document.createElement('p');
    cartElement.innerHTML = `${cartList[i].amount}x - ${cartList[i].name}`
    cartElement.className = "cartItem";
    cartElement.addEventListener("touchstart", () => RemoveFromCart(i));
    cartElement.addEventListener("click", () => RemoveFromCart(i));

    document.getElementById('cartList').append(cartElement);
  }

  let finalCost = Math.abs(Number(cost)).toFixed(2)
  document.getElementById('totalCost').innerHTML = `Cost: €${finalCost}`;
  if (finalCost > 0) {
    let balance = parseFloat(document.getElementById('balance').innerHTML.substr(1)) || 0;
    document.getElementById('newBalance').innerHTML = `New balance: €${Number(balance - finalCost).toFixed(2)}`;
  } else {
    document.getElementById('newBalance').innerHTML = null;
  }
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
    uuid: uuid,
    items: ''
  }

  cartList.forEach(item => {
    for (let i = 0; i < item.amount; i++)
      userInfo.items += `${item.id},`;
  });

  userInfo.items = `[${userInfo.items.slice(0, -1)}]`

  ipcRenderer.send('request', {
    name: 'purchase',
    type: 'POST',
    url: `api/checkout/transaction`,
    body: {
      uuid: userInfo.uuid,
      items: userInfo.items
    }
  });
}

// Handle purchase response
ipcRenderer.on('purchase', (event, arg) => {
  if (arg.err !== null) {
    console.error(arg.err);
  } else {
    let res = JSON.parse(arg.data);
    let newBalance = parseFloat(res.balance).toFixed(2);
    document.getElementById('balance').innerHTML = `€${newBalance}`
    module.exports.ClearCart();
  }
});

let query = querystring.parse(global.location.search)
let uuid = JSON.parse(query['?uuid']);
