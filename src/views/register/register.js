const studentinput = document.querySelector(".studentinput")
document.querySelectorAll('.key').forEach((element, index) => {
    element.addEventListener('click', function(e) {
        studentinput.value += element.value

    });
  });
