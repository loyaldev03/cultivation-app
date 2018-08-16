//= require siema/dist/siema.min.js

function clearSelection()
{
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}

// Bind Carousel as pageSize card in a row (used in Rooms / Rows setup)
function bindCarousel(gotoLast) {
  const pageSize = 4;
  const siemaElms = $$(".siema");
  if (siemaElms) {
    for (let i = 0; i < siemaElms.length; i++) {
      const siemaElm = siemaElms[i]
      const carousel = siemaElm.closest(".carousel")
      const cardCount = siemaElm.children.length;
      if (cardCount >= pageSize) {
        console.log('new Siema', i)
        const mySiema = new Siema({ selector: siemaElm, perPage: pageSize, loop: true });
        const leftBtn = carousel.children[0]
        const rightBtn = carousel.children[2]
        leftBtn.addEventListener("click", () => mySiema.prev());
        rightBtn.addEventListener("click", () => mySiema.next());
        if (gotoLast) {
          mySiema.goTo(cardCount - pageSize);
          // Note: Clear highlighted elements when added / deleting
          setTimeout(() => clearSelection(), 300);
        }
      } else {
        if (cardCount == 1) {
          // when the carousel is empty (only contain the "Add" card
          carousel.classList.add("carousel--empty")
        }
        // when the carousel contains less then pageSize
        siemaElm.classList.add("carousel__body--less")
      }
    }
  }
}

