function setupRadioToggle(filter = null) {
  console.log("setupRadioToggle");

  let selector = 'input[data-toggle]';
  if (filter) {
    selector = filter + ' ' + selector;
  }

  $$(selector).on('change', function(e) {
    $$(selector).forEach(function(g) {
      var defaultTarget = g.getAttribute('data-toggle');
      if (g.checked) {
        // console.log(g.checked);
        $$(defaultTarget)[0].style.display = "";
      } else {
        $$(defaultTarget)[0].style.display = "none";
      }
    });
  });

  var changeEvent = new Event("change");
  var checkedSelector = selector + '[checked]';
  $$(checkedSelector).forEach(function(t) { t.dispatchEvent(changeEvent) });
}

function setupCheckboxToggle() {
  let selector = 'input[data-toggle]';
  $$(selector).on('change', function(e) {
    let toggleTarget = e.target.getAttribute('data-toggle')
    let targetDisplay = e.target.checked ? "" : "none"
    $$("." + toggleTarget).forEach(function(tElm) {
      tElm.style.display = targetDisplay
      tElm.classList.add("animated","faster","fadeIn")
    })
  })
}
