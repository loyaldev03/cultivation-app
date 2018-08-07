//= require siema/dist/siema.min.js

// Bind Carousel as 4 card in a row (used in Rooms / Rows setup)
function bindCarousel(gotoLast) {
  const siemaElm = $_(".siema");
  if (siemaElm) {
    const cardCount = siemaElm.children.length;
    if (cardCount >= 4) {
      const mySiema = new Siema({
        perPage: 4,
        loop: true,
      });
      $_('.carousel__button--left').on('click', function() { mySiema.prev() });
      $_('.carousel__button--right').on('click', function() { mySiema.next() });

      if (gotoLast) {
        mySiema.goTo(cardCount - 4);

        // Note: Fix for accidental select entire carousel when user click add / delete.
        //       Clicking the body will under any selection
        document.body.click();
      }
    }
    else {
      siemaElm.classList.add('carousel__body--less')
    }
  }
}

