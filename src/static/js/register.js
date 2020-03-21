const { ipcRenderer } = require('electron');
const studentInput = document.querySelector(".studentinput");

// Init the div as a modal
$('.ui.basic.modal')
  .modal();

function RegisterCard(studentNr) {
  ipcRenderer.send('request', {
    name: 'register',
    type: 'POST',
    url: 'api/checkout/card',
    body: {
      student: studentNr,
      uuid: 'ec3ed712s' // Need to implement with nfc.
    }
  })
}

ipcRenderer.on('register', (event, arg) => {
  console.log(arg)
  if (arg !== null && arg.statusCode == 201) {
    // On success
    $('.ui.basic.modal').modal({onHidden: function(){
      ipcRenderer.send("register-finished")
    }})
      .modal('show');
  } else if (arg.statusCode == 404) {
    // If ID wasn't found in the database
    $('body')
      .toast({
        class: 'error',
        message: 'Student ID was not found in the database. Please try again later'
      })
  } else if (arg.statusCode == 409) {
    // Card already registered
    $('body')
      .toast({
        class: 'error',
        message: 'Card has already been registered.'
      })
  } else {
    // Other errors
    console.log(arg.statusCode)
    $('body')
      .toast({
        class: 'massive error',
        message: 'Something went wrong.'
      })
  }
})

// Listener for custom keypad
document.querySelectorAll('.key').forEach((element, index) => {
  element.addEventListener('click', function (e) {
    studentInput.value += element.getAttribute('value')
  });
});

// Backspace for custom keypad
document.querySelector(".undo").addEventListener('click', function (e) {
  studentInput.value = studentInput.value.slice(0, -1);
});

//Validates studentnumber it works the same as ISBN-10/13 but with with 7
function validate(input,i,sum=0){
  for(i = 0; i < input.length; i++){
    sum += parseInt(input[i]) * (input.length - i);
  }
  return (sum % 11) == 0
}

// Register button
document.querySelector(".register").addEventListener('click', function (e) {
  if (/\F\d{6}/.test(studentInput.value) || (/\d{7}/.test(studentInput.value) && validate(studentInput.value))) {
    RegisterCard(studentInput.value);
  } else {
    $('.ui.massive.input').popup('show');
  }
});
