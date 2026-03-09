const { ipcRenderer } = require('electron');
const querystring = require('querystring');

function AddToFavorites (htmlElem, productId) {
  ipcRenderer.send('request', {
    name: 'addFavorite',
    type: 'POST',
    url: `api/favorite/toggle`,
    body: {product_id: productId, uuid: window.uuid}
  });
}
module.exports.AddToFavorites = AddToFavorites;

ipcRenderer.on('addFavorite', (event, arg) => {
  if (arg.err == null && arg.data == null) return;

  if (arg.err !== null) {
    console.error(arg.err);
    $('body').toast({
      class: 'error',
      message: "Favoriting failed, please try again!"
    });
    let errSound = new Audio('../../static/audio/error.mp3');
    errSound.play();
    return;
  }

  let res = JSON.parse(arg.data);

  const products = document.querySelectorAll(`[data-product-id="${res.product_id}"]`);
  const favoriteCategory = document.querySelector('#productList > article > section');

  switch (res.status) {
    case "removed":
      products.forEach(it => it.querySelector(".favorite-overlay").innerText = "☆");
      const child = favoriteCategory.querySelector(`[data-product-id="${res.product_id}"]`);
      favoriteCategory.removeChild(child);

      if (favoriteCategory.childNodes.length == 0) favoriteCategory.parentNode.style.display = "none";
      break;
    case "added":
      if (favoriteCategory == null) break;
      if (favoriteCategory.childNodes.length == 0) favoriteCategory.parentNode.style.display = "block";

      products.forEach(it => it.querySelector(".favorite-overlay").innerText = "⭐");
      const newProduct = products[0].cloneNode(true);
      const favoriteButton = newProduct.getElementsByClassName('favorite-overlay')[0];
      favoriteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        AddToFavorites(newProduct, res.product_id);
      });

      favoriteCategory.appendChild(newProduct);
      break;
    default:
      $('body').toast({
        class: 'error',
        message: "Favoriting failed, please try again!"
      });
      let errSound = new Audio('../../static/audio/error.mp3');
      errSound.play();
      break;
  }
});
