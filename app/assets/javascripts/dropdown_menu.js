function toggleDropdown() {
  $_('#myDropdown').classList.toggle('show')
}

document.addEventListener('DOMContentLoaded', function() {
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = $_('.dropdown-content')

      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i].value;
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show')
        }
      }
    }
  }
})

