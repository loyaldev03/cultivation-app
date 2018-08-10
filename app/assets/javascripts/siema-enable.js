//= require siema/dist/siema.min.js

function clearSelection()
{
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}

// Bind Carousel as pageSize card in a row (used in Rooms / Rows setup)
function bindCarousel(gotoLast) {
  const siemaElms = $$(".siema");
  const pageSize = 4;
  if (siemaElms) {
    for (let i = 0; i < siemaElms.length; i++) {
      const siemaElm = siemaElms[i]
      const cardCount = siemaElm.children.length;
      if (cardCount >= pageSize) {
        const mySiema = new Siema({ perPage: pageSize, loop: true });
        $_(".carousel__button--left").on("click", function() { mySiema.prev() });
        $_(".carousel__button--right").on("click", function() { mySiema.next() });
        if (gotoLast) {
          mySiema.goTo(cardCount - pageSize);
          // Note: Clear highlighted elements when added / deleting
          setTimeout(function(){
            clearSelection();
          }, 300);
        }
      } else {
        console.log({cardCount})
        if (cardCount == 1) {
          siemaElm.closest(".carousel").classList.add("carousel--empty")
        }
        // when the carousel contains less then pageSize
        siemaElm.classList.add("carousel__body--less")
      }
    }
  }
}

