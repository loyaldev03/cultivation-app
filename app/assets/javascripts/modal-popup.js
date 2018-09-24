document.addEventListener("DOMContentLoaded", function(event) {
  var modal = $_('#myModal');

  $_('#notification-popup').on("click", function() {
    modal.style.display = 'block';
  })

  $_('#close-modal').on("click", function() {
    modal.style.display = "none";
  })
})