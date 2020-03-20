const {ipcRenderer} = require('electron')
const studentinput = document.querySelector(".studentinput")

function RegisterCard(studentnr) {
    ipcRenderer.send('request', {
        name: 'register',
        type: 'POST',
        url:  'api/checkout/card',
        body: {
            student: studentnr,
            uuid: "Dummyssssss" // Need to implement with nfc.
        }
    })
}

ipcRenderer.on('register', (event,arg) => {
  if (arg.data.statusCode == 201){
    $('ui.basic.modal').modal('show')
  }
  else{
  }
 
})

document.querySelectorAll('.key').forEach((element, index) => {
    element.addEventListener('click', function (e) {
        studentinput.value += element.getAttribute('value')
    });
});

document.querySelector(".undo").addEventListener('click', function (e) {
    studentinput.value = studentinput.value.slice(0, -1);
});



//Validates studentnumber it works the same as ISBN-10/13 but with with 7
function validate(a, b, c) {
    b = 0;
    for (c in a) b += a[c] * (c % 2 ? 3 : 1);
    return !(b % 6)
}

document.querySelector(".register").addEventListener('click', function (e) {
    
    if (/\F\d{6}/.test(studentinput.value) || (/\d{7}/.test(studentinput.value) && validate(studentinput.value))) {
      console.log('registering cards');
      RegisterCard(studentinput.value);
    } else {
        $('.ui.massive.input').popup('show');
    }
});
