//= require siema/dist/siema.min.js
function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

// Bind Carousel as pageSize card in a row (used in Rooms / Rows setup)
function bindCarousel(gotoIndex = 0) {
  const siemaElms = $$('.siema')
  const siemaPageSize = 4
  const siemaOptions = {
    perPage: siemaPageSize,
    draggable: true,
    multipleDrag: true,
    loop: true
  }
  if (siemaElms) {
    for (let i = 0; i < siemaElms.length; i++) {
      const siemaElm = siemaElms[i]
      const carousel = siemaElm.closest('.carousel')
      const cardCount = siemaElm.children.length
      if (cardCount > siemaPageSize) {
        const mySiema = new Siema(
          Object.assign(siemaOptions, { selector: siemaElm })
        )
        const leftBtn = carousel.children[0]
        const rightBtn = carousel.children[2]
        leftBtn.addEventListener('click', () => mySiema.prev())
        rightBtn.addEventListener('click', () => mySiema.next())
        if (!gotoIndex) {
          // Go to first
          mySiema.goTo(0)
        }
        else if (gotoIndex === -1) {
          // Go to last
          mySiema.goTo(cardCount - siemaPageSize)
        }
        else {
          mySiema.goTo(gotoIndex)
        }
        // Note: Clear highlighted elements when added / deleting
        setTimeout(() => clearSelection(), 300)
      } else {
        if (cardCount == 1) {
          // when the carousel is empty (only contain the "Add" card
          carousel.classList.add('carousel--empty')
        }
        // when the carousel contains less then siemaPageSize
        siemaElm.classList.add('carousel__body--less')
      }
    }
  }
}
