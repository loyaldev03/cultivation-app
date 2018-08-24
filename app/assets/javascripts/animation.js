function show(elm) {
  if (elm) {
    elm.style.removeProperty("display")
    elm.classList.add("animated", "faster", "fadeIn");
  }
}

function hide(elm) {
  if (elm) {
    elm.classList.remove("fadeIn");
    elm.classList.add("animated", "faster", "fadeOut");
    setTimeout(function(){
      elm.style.display = "none"
      elm.classList.remove("animated", "faster", "fadeOut");
    }, 300);
  }
}

function highlight(elm) {
  if (elm) {
    elm.classList.add("highlight");
    setTimeout(function(){
      elm.classList.remove("highlight");
    }, 1000);
  }
}
