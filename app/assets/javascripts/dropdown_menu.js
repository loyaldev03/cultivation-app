function toggleDropdown() {
  //document.getElementById("myDropdown").classList.toggle("show");
  $_("#myDropdown").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function(event) {
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
  
      var dropdowns = $_(".dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
});

