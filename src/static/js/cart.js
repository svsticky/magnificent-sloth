let cartList = new Array();
let cost = 0;

module.exports.AddToCart = (product) => {
  let alreadyInCart = cartList.filter(prod => prod.id === product.id);
  console.log(product.price)
  cost += Number(product.price);
  
  if(alreadyInCart.length !== 0) {
    let index = cartList.indexOf(alreadyInCart[0]);
    cartList[index].amount++;
  } else {
    product.amount = 1;
    cartList.push(product);
  }
  renderCart();
}

function renderCart() {
  document.getElementById('cartList').innerHTML = '';
  for(let i = 0; i < cartList.length; i++) {
    let cartElement = document.createElement('p');
    cartElement.innerHTML = `${cartList[i].amount}x - ${cartList[i].name}`
    document.getElementById('cartList').append(cartElement);
  }
  document.getElementById('totalCost').innerHTML = `€${Number(cost).toFixed(2)}`;
}

renderCart();