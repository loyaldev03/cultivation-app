function setupRadioToggle(filter = null) {
  console.log("setupRadioToggle");

  let selector = 'input[data-toggle]';
  if (filter) {
    selector = filter + ' ' + selector;
  }

  $$(selector).on('change', function(e) {
    $$(selector).forEach(function(g) {
      let defaultTarget = g.getAttribute('data-toggle');
      if (g.checked) {
        // console.log(g.checked);
        $$(defaultTarget)[0].style.display = "";
      } else {
        $$(defaultTarget)[0].style.display = "none";
      }
    });
  });

  let changeEvent = new Event("change");
  let checkedSelector = selector + '[checked]';
  $$(checkedSelector).forEach(function(t) { t.dispatchEvent(changeEvent) });
}

function updateToggleDisplay() {
  let selector = 'input[data-toggle]';
  $$(selector).forEach(function(e1) {
    let toggleTarget = e1.getAttribute('data-toggle');
    let targetDisplay = e1.checked ? "" : "none";
    $$("." + toggleTarget).forEach(function(e2) {
      e2.style.display = targetDisplay;
      e2.classList.add("animated", "faster", "fadeIn");
    })
  })
}

function setupCheckboxToggle() {
  console.log('setupCheckboxToggle')
  let selector = 'input[data-toggle]';
  $$(selector).on('change', updateToggleDisplay);
  updateToggleDisplay();
}

function updateToggleCollapsible(e) {
  const targetClass = e.target.getAttribute('data-toggle')
  const targetElm = $_(`[data-collapse="${targetClass}"]`)
  if (!targetElm) {
    return;
  }
  if (e.target.checked) {
    targetElm.style.display = "none"
  } else {
    targetElm.style.removeProperty("display")
  }
}

function setupCollapsible() {
  let selector = 'input[role="toggle"]';
  $$(selector).on('change', updateToggleCollapsible)
}
