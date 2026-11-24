const { ipcRenderer } = require('electron');
const querystring = require('querystring');

let cartList = new Array();
let cost = 0;
const ChipiChapa_ID = 26;

document.addEventListener('DOMContentLoaded', e => {
  document.getElementById('purchase').addEventListener('click', confirmPurchase);
  document.getElementById('purchaseConfirmed').addEventListener('click', purchase);
  $('.ui.modal.confirmPurchase').modal('attach events', '#purchase', 'show');
});

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
  let balance = parseFloat(document.getElementById('balance').innerHTML.substr(1)) || 0;
  document.getElementById('newBalance').innerHTML = `New balance: €${Number(balance - finalCost).toFixed(2)}`;

  if (cartList.length === 0 ) {
    document.getElementById('purchase').className = "ui button primary disabled"
  }
  else {
    document.getElementById('purchase').className = "ui button primary"
  }
}

module.exports.ClearCart = () => {
  cartList = new Array();
  cost = 0;
  module.exports.RenderCart();
}

function playChipiChapaSound() {
  const boughtChipiChapa = cartList.some(product =>
    Number(product.id) === ChipiChapa_ID
  );

  if (!boughtChipiChapa) {
    return;
  }

  const chipiChapaSound = new Audio(
    '../../static/audio/ChipiChapa.mp3'
  );

  chipiChapaSound.play().catch(error => {
    console.error('Could not play ChipiChapa sound:', error);
  });
}

function confirmPurchase(e) {
  e.preventDefault();
  document.getElementById("confirmOldBalance").innerHTML = document.getElementById("balance").innerHTML;
  document.getElementById("confirmProductTotal").innerHTML = "€" + Math.abs(Number(cost)).toFixed(2);
  document.getElementById("confirmNewBalance").innerHTML = document.getElementById("newBalance").innerHTML.split(" ")[2];
  document.getElementById('confirmItemList').innerHTML = '';
  for(let index in cartList) {
    let cartElement = document.createElement('ul');
    cartElement.innerHTML = `${cartList[index].amount}x - ${cartList[index].name}`
    cartElement.className = "cartItem";
    document.getElementById('confirmItemList').append(cartElement);
  }
}

// Event for when the user click purchase. Send a request to Koala
// to handle the payment for us.
function purchase() {
  if (document.getElementById("confirmNewBalance").innerHTML.indexOf("-") != -1) {
    let errSound = new Audio('../../static/audio/error.mp3');
    errSound.volume = 1;
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

  if (userInfo.items.length === 0) {
    let errSound = new Audio('../../static/audio/error.mp3');
    errSound.play();
    $('body').toast({
      class: 'error',
      message: "You can't purchase nothing!"
    });
    return
  }

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
    if (res) {
      let newBalance = parseFloat(res.balance).toFixed(2);
      document.getElementById('balance').innerHTML = `€${newBalance}`

      playChipiChapaSound();

      module.exports.ClearCart();

      let sound = new Audio('../../static/audio/money.mp3');
      sound.play();
      setTimeout(() => sound.pause(), 10000);
    }
  }
});

// Barcode scanner support. A USB scanner behaves like a keyboard that types
// the barcode very quickly followed by Enter. Keystrokes are only observed
// (never prevented), and anything slower than a scanner is ignored, so
// normal typing is unaffected.
const SCAN_MAX_KEY_GAP_MS = 50;
const SCAN_MIN_LENGTH = 4;
let scanBuffer = '';
let scanLastKeyTime = 0;

// This eventlistener only activates on keypresses by a barcode scanner,
// Which send very quickly. Any special key or input too slow empties the buffer.
// The result of this (should) be that normal typing is not affected.
document.addEventListener('keydown', e => {
  const now = Date.now();
  const fast = now - scanLastKeyTime <= SCAN_MAX_KEY_GAP_MS;
  scanLastKeyTime = now;

  if (e.ctrlKey || e.altKey || e.metaKey) {
    scanBuffer = '';
  } else if (e.key === 'Enter') {
    if (fast && scanBuffer.length >= SCAN_MIN_LENGTH) scanBarcode(scanBuffer);
    scanBuffer = '';
  } else if (e.key.length === 1) {
    scanBuffer = fast ? scanBuffer + e.key : e.key;
  }
});

function scanError(message) {
  $('body').toast({ class: 'error', message: message });
  new Audio('../../static/audio/error.mp3').play();
}

function scanBarcode(barcode) {
  // Scanning is only allowed on the products page. Every other usage of the scanner shows an error 
  if (document.getElementById('products-page').classList.contains('hidden')) {
    scanError('Open the Products page to scan items.');  
    return;
  }

  ipcRenderer.send('request', {
    name: 'scanProduct',
    type: 'GET',
    url: `api/product/barcode?uuid=${uuid}&barcode=${encodeURIComponent(barcode)}`,
    body: null
  });
}

// Handle barcode lookup response
ipcRenderer.on('scanProduct', (event, arg) => {
  if (arg.err === null) {
    if (arg.data === null) return;
    module.exports.AddToCart(JSON.parse(arg.data));
    return;
  }

  console.error(arg.statusCode, arg.err);
  switch (arg.statusCode) {
    case 404: // Both an unknown card and an unknown product give 404; the body tells which
      if (arg.data === 'Card not found') {
        scanError('Your card was not recognised. Please scan your card again.');
      } else {
        scanError('This product was not found.');
      }
      break;
    case 410:
      scanError('This product is no longer for sale.');
      break;
    case 403: // Specific error for (not) being allowed to buy alcohol
      scanError('You are not allowed to buy this product (right now).');
      break;
    default:
      scanError('Scanning failed, please try again.');
  }
});

let query = querystring.parse(global.location.search)
let uuid = JSON.parse(query['?uuid']);
