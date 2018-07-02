document.addEventListener("DOMContentLoaded", function(event) {
  $$("#toggle-sidebar").on("click", function() {
    var sidebar = $$("#sidebar")[0];
    var main = $$("#main")[0];
    if (sidebar.className.indexOf("uncollapsed") >= 0) {
      sidebar.className = sidebar.className.replace(/ uncollapsed/g, ' collapsed');
      main.style.paddingLeft = "80px";
    } else {
      sidebar.className = sidebar.className.replace(/ collapsed/g, ' uncollapsed');
      main.style.paddingLeft = "230px";
    }
  });
});


document.addEventListener("DOMContentLoaded", function(event) {
  // console.log('sidebar loaded...');
  var rightSidebar = $_("#right-sidebar");

  if (rightSidebar) {
    $$("[data-toggle-right]").on("click", function(e) {
      rightSidebar.style.width = "50%";

      Rails.ajax({
        url: this.dataset.toggleRight,
        type: 'GET',
        dataType : 'script',
        success: function(data) { 
        }
      });
      e.preventDefault();
    });
  }

  var hideSidebar = $_("#hide-sidebar");
  if (hideSidebar) {
    hideSidebar.on("click", function(e){
      rightSidebar.style.width = "0%";
      e.preventDefault();
    });
  }
});



