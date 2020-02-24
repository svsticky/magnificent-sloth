const fs = require('fs');
const path = require('path');

function renderHTML(page) {
  page = path.join(__dirname, page);

  const file = fs.readFileSync(page);
  document.getElementById('content').innerHTML = file;
}

document.querySelectorAll('.link').forEach((element, index) => {
  element.addEventListener('click', function(e) {
    renderHTML(`../${element.id}/${element.id}.html`);
  });
});

renderHTML('../../views/products/products.html');