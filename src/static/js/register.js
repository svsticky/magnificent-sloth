const {
  ipcRenderer
} = require('electron')
const studentInput = document.querySelector(".studentinput")
const popup = document.getElementById("popup")
$('.ui.basic.modal')
  .modal();


function RegisterCard(studentNr) {
  ipcRenderer.send('request', {
    name: 'register',
    type: 'POST',
    url: 'api/checkout/card',
    body: {
      student: studentNr,
      uuid: 'ec3ed712sss' // Need to implement with nfc.
    }
  })
}
ipcRenderer.on('register', (event, arg) => {

  if (arg !== null && arg.statusCode == 201) {
    $('.ui.basic.modal').modal({onHidden: function(){
      ipcRenderer.send("register-finished")
    }})
      .modal('show');

  } else if (arg.statusCode == 404) {
    $('body')
      .toast({
        class: 'error',
        message: 'Studentid could not be found.'
      })
  } else if (arg.statusCode == 409) {
    $('body')
      .toast({
        class: 'error',
        message: 'Card has already been registered.'
      })
  } else {
    console.log(arg.statusCode)
    $('body')
      .toast({
        class: 'massive error',
        message: 'Something went wrong.'
      })
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
    RegisterCard(studentInput.value);
  } else {
    $('.ui.massive.input').popup('show');
  }
});