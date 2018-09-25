function hideModal() {
  console.log("close")
   $_('.modal').classList.add("dn");
}

document.addEventListener('DOMContentLoaded', function(event) {
  var modal = $_('#myModal');
  const targetCard = $('#notification-popup');
  const modalCard = $('.modal'); 

  $_('#notification-popup').on('click', function() {
    modal.style.display = 'block'
  })

  // $_('#close-modal').on("click", function() {
  //   console.log("close")
  //   //modal.style.display = "none";
  //   $_('.modal').classList.add("dn");
  // })
})
