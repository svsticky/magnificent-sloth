const { ipcRenderer } = require('electron');
const querystring = require('querystring');

let cartList = new Array();
let cost = 0;

// Init the div as a modal
$('#confirmPurchase').modal();

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

  if (cartList.length === 0 ) {
    document.getElementById('purchase').className = "ui button primary disabled"
  }
  else {
    document.getElementById('purchase').className = "ui button primary"
  }

  document.getElementById('purchase').addEventListener('click', purchase);
  document.getElementById('purchaseConfirmed').addEventListener('click', purchase);
}

module.exports.ClearCart = () => {
  cartList = new Array();
  cost = 0;
  module.exports.RenderCart();
}

function confirmPurchase() {
  document.getElementById("confirmOldBalance").innerHTML = document.getElementById("balance").innerHTML;
  document.getElementById("confirmProductTotal").innerHTML = "€" + Math.abs(Number(cost)).toFixed(2);
  document.getElementById("confirmNewBalance").innerHTML = document.getElementById("newBalance").innerHTML.split(" ")[2];
  for(let index in cartList) {
    let cartElement = document.createElement('ul');
    cartElement.innerHTML = `${cartList[index].amount}x - ${cartList[index].name}`
    cartElement.className = "cartItem";
    document.getElementById('confirmItemList').append(cartElement);
  }
  $('#confirmPurchase').modal('show');
}

// Event for when the user click purchase. Send a request to Koala
// to handle the payment for us.
function purchase() {
  if (document.getElementById("confirmNewBalance").innerHTML.indexOf("-") != -1) {
    let errSound = new Audio('../../static/audio/error.mp3');
    errSound.play();
    $('body').toast({
      class: 'error',
      message: "You can't have a negative balance!"
    });
    return
  }

  let userInfo = {
    uuid: uuid,
    items: []
  }

  cartList.forEach(item => {
    userInfo.items.push({
      id: item.id,
      amount: item.amount
    });
  });

  ipcRenderer.send('request', {
    name: 'purchase',
    type: 'POST',
    url: `api/transaction`,
    body: userInfo
  });
}

// Handle purchase response
ipcRenderer.on('purchase', (event, arg) => {
  console.log(arg)
  if (arg.err !== null) {
    console.error(arg.err);
    $('body').toast({
      class: 'error',
      message: "Your purchase failed, please try again!"
    });
    let errSound = new Audio('../../static/audio/error.mp3');
    errSound.play();
  } else {
    let res = JSON.parse(arg.data);
    let newBalance = parseFloat(res.balance).toFixed(2);
    document.getElementById('balance').innerHTML = `€${newBalance}`
    module.exports.ClearCart();
    let sound = new Audio('../../static/audio/money.mp3');
    sound.play();
  }
});

let query = querystring.parse(global.location.search)
let uuid = JSON.parse(query['?uuid']);
