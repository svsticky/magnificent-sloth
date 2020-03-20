const { ipcRenderer } = require('electron')
const studentInput = document.querySelector(".studentinput")

function RegisterCard(studentNr) {
  ipcRenderer.send('request', {
    name: 'register',
    type: 'POST',
    url:  'api/checkout/card',
    body: {
      student: studentNr,
      uuid: 'ec3ed712' // Need to implement with nfc.
    }
  })
}

ipcRenderer.on('register', (event, arg) => {
  if (arg !== null && arg.statusCode == 201){
    console.log(arg)
    $('ui.basic.modal').modal('show')
  }
  else{
    console.error(arg.err)
  }
})

document.querySelectorAll('.key').forEach((element, index) => {
  element.addEventListener('click', function (e) {
    studentInput.value += element.getAttribute('value')
  });
});

document.querySelector(".undo").addEventListener('click', function (e) {
  studentInput.value = studentInput.value.slice(0, -1);
});

//Validates studentnumber it works the same as ISBN-10/13 but with with 7
function validate(a, b, c) {
  b = 0;
  for (c in a) b += a[c] * (c % 2 ? 3 : 1);
    return !(b % 6)
}

document.querySelector(".register").addEventListener('click', function (e) {
  if (/\F\d{6}/.test(studentInput.value) || (/\d{7}/.test(studentInput.value) && validate(studentInput.value))) {
    console.log('Registering cards');
    RegisterCard(studentInput.value);
  } else {
    $('.ui.massive.input').popup('show');
  }
});
